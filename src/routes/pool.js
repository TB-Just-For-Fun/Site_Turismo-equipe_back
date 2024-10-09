const pool = require('../config/db');

const Feedback = {
    create: async (userId, rating, comment) => {
        const result = await pool.query(
            'INSERT INTO feedback (user_id, rating, comment) VALUES ($1, $2, $3) RETURNING *',
            [userId, rating, comment]
        );
        return result.rows[0];
    },
    getAll: async () => {
        const result = await pool.query('SELECT * FROM feedback');
        return result.rows;
    }
};

module.exports = Feedback;
