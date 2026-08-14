const { getPool } = require('./_db');

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `select id, name, description, image_url, quantity, pricing_tiers
       from items where active = true order by name asc`
    );
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
