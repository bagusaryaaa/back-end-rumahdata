    import { pool } from "../src/db.js";

    export const getUsersList = async (req, res) => {
    try {
        const query = `
        SELECT 
            id,
            nip,
            nama,
            role,
            status
        FROM users
        ORDER BY id ASC
        `;

        const result = await pool.query(query);

        res.status(200).json({
        success: true,
        total: result.rowCount,
        data: result.rows
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
        success: false,
        message: "Gagal mengambil data users"
        });
    }
    };
