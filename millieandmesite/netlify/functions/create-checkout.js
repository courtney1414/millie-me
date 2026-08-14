const Stripe = require('stripe');
const { getPool } = require('./_db');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { itemId, startDate, endDate, tierLabel, customerName, customerEmail, customerPhone } = payload;

  if (!itemId || !startDate || !endDate || !tierLabel || !customerName || !customerEmail) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }
  if (new Date(endDate) < new Date(startDate)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'endDate must be on/after startDate' }) };
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'STRIPE_SECRET_KEY is not configured' }) };
  }
  const stripe = Stripe(stripeSecret);
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Lock the item row so concurrent bookings for the same item serialize.
    const { rows: itemRows } = await client.query(
      'select * from items where id = $1 for update',
      [itemId]
    );
    if (itemRows.length === 0) {
      await client.query('ROLLBACK');
      return { statusCode: 404, body: JSON.stringify({ error: 'Item not found' }) };
    }
    const item = itemRows[0];
    const tier = (item.pricing_tiers || []).find((t) => t.label === tierLabel);
    if (!tier) {
      await client.query('ROLLBACK');
      return { statusCode: 400, body: JSON.stringify({ error: 'Unknown pricing tier' }) };
    }

    // Count overlapping active bookings against the item's available quantity.
    const { rows: overlapRows } = await client.query(
      `select count(*)::int as cnt from bookings
       where item_id = $1 and status in ('pending','confirmed','blocked')
       and start_date <= $3 and end_date >= $2`,
      [itemId, startDate, endDate]
    );
    if (overlapRows[0].cnt >= item.quantity) {
      await client.query('ROLLBACK');
      return { statusCode: 409, body: JSON.stringify({ error: 'Selected dates are no longer available' }) };
    }

    const { rows: inserted } = await client.query(
      `insert into bookings (item_id, start_date, end_date, tier_label, price_cents, customer_name, customer_email, customer_phone, status)
       values ($1,$2,$3,$4,$5,$6,$7,$8,'pending') returning id`,
      [itemId, startDate, endDate, tierLabel, tier.price_cents, customerName, customerEmail, customerPhone || null]
    );
    const bookingId = inserted[0].id;

    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:8888';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: tier.price_cents,
            product_data: {
              name: `${item.name} — ${tierLabel} (${startDate} to ${endDate})`,
            },
          },
        },
      ],
      metadata: { bookingId },
      success_url: `${siteUrl}/booking-confirmed.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/item.html?id=${encodeURIComponent(itemId)}`,
    });

    await client.query('update bookings set stripe_session_id = $1 where id = $2', [session.id, bookingId]);
    await client.query('COMMIT');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    await client.query('ROLLBACK');
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    client.release();
  }
};
