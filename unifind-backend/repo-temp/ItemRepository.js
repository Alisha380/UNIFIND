
class ItemRepository {
    constructor(db) {
        this.db = db;
    }

    // Fetch all reports
    getAll() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM reports ORDER BY created_at DESC";

            this.db.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    // Create a new report
    create(data) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO reports
                (type, name, item_name, location, email, msg, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                data.type,
                data.name,
                data.item_name,
                data.location,
                data.email,
                data.msg,
                data.image_url
            ];

            this.db.query(sql, values, (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    }

    // Delete a report
    deleteById(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM reports WHERE id = ?";

            this.db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows);
            });
        });
    }

    // Update a report
    updateById(id, data) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE reports
                SET item_name = ?, location = ?, category = ?, type = ?, msg = ?, image_url = ?
                WHERE id = ?
            `;

            const values = [
                data.item_name,
                data.location,
                data.category,
                data.type,
                data.msg,
                data.image_url,
                id
            ];

            this.db.query(sql, values, (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows);
            });
        });
    }
}

module.exports = ItemRepository;
