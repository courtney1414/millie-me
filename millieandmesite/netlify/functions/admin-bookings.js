const { getPool } = require('./_db');

function checkAuth(event) {
  const provided = event.headers['x-admin-password'] || '';
  const expected = process.env.ADMIN_PASSWORD || '';
  return expected && provided === expected;
}

exports.handler = async function (event) {
  if (!checkAuth(event)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }
  const pool = getPool();

  try {
    if (event.httpMethod === 'GET') {
      const { rows } = await pool.query(
        `select b.*, i.name as item_name from bookings b
         join items i on i.id = b.item_id
         order by b.start_date desc`
      );
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rows) };
    }

    if (event.httpMethod === 'POST') {
      // Manually block off dates (maintenance, damaged item, offline booking, etc.)
      const { itemId, startDate, endDate, note } = JSON.parse(event.body || '{}');
      if (!itemId || !startDate || !endDate) {
        return { statusCode: 400, body: JSON.stringify({ error: 'itemId, startDate, endDate required' }) };
      }
      const { rows } = await pool.query(
        `insert into bookings (item_id, start_date, end_date, tier_label, price_cents, customer_name, customer_email, status)
         values ($1,$2,$3,'Blocked',0,$4,'internal@millieandme.local','blocked') returning *`,
        [itemId, startDate, endDate, note || 'Blocked by admin']
      );
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rows[0]) };
    }

    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters && event.queryStringParameters.id;
      if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'id required' }) };
      await pool.query("update bookings set status = 'cancelled' where id = $1", [id]);
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, body: 'Method not allowed' };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
