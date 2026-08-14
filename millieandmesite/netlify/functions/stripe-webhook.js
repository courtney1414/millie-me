const Stripe = require('stripe');
const { getPool } = require('./_db');

// Configure this URL as a webhook endpoint in your Stripe dashboard:
//   https://<your-site>.netlify.app/.netlify/functions/stripe-webhook
// listening for the "checkout.session.completed" and
// "checkout.session.expired" events, then copy the "Signing secret" into
// STRIPE_WEBHOOK_SECRET.
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecret || !webhookSecret) {
    return { statusCode: 500, body: 'Stripe env vars not configured' };
  }
  const stripe = Stripe(stripeSecret);

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      event.headers['stripe-signature'],
      webhookSecret
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook signature verification failed: ${err.message}` };
  }

  const pool = getPool();

  try {
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      const bookingId = session.metadata && session.metadata.bookingId;
      if (bookingId) {
        await pool.query("update bookings set status = 'confirmed' where id = $1", [bookingId]);
      }
    }

    if (stripeEvent.type === 'checkout.session.expired') {
      const session = stripeEvent.data.object;
      const bookingId = session.metadata && session.metadata.bookingId;
      if (bookingId) {
        await pool.query("update bookings set status = 'cancelled' where id = $1 and status = 'pending'", [bookingId]);
      }
    }

    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
