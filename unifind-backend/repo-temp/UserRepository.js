
class UserRepository {
  constructor(db) {
    this.db = db;
  }

  createUser(user) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users
        (first_name, last_name, email, username, password)
        VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        user.first_name,
        user.last_name,
        user.email,
        user.username,
        user.password
      ];

      this.db.query(sql, values, (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }

  findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';

      this.db.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  }

  findByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';

      this.db.query(sql, [username], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  }
}

module.exports = UserRepository;
