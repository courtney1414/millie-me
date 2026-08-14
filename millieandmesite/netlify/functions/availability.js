const { getPool } = require('./_db');

// Returns every active (pending/confirmed/blocked) date range currently held
// for an item, so the frontend calendar can grey out unavailable days.
// GET /api/availability?itemId=<id>
exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  const itemId = event.queryStringParameters && event.queryStringParameters.itemId;
  if (!itemId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'itemId is required' }) };
  }

  try {
    const pool = getPool();
    const { rows: itemRows } = await pool.query('select quantity from items where id = $1', [itemId]);
    if (itemRows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'item not found' }) };
    }
    const quantity = itemRows[0].quantity;

    const { rows } = await pool.query(
      `select start_date, end_date, status from bookings
       where item_id = $1 and status in ('pending','confirmed','blocked')
       order by start_date asc`,
      [itemId]
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, bookedRanges: rows }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
