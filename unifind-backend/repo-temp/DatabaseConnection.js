
const mysql = require('mysql2');

class DatabaseConnection {

  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123456789',
      database: 'unifind_db'
    });

    DatabaseConnection.instance = this;
  }

  connect() {
    this.connection.connect((err) => {
      if (err) {
        console.error('Database connection failed:', err);
        return;
      }

      console.log('Connected to MySQL Database.');
    });
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
      DatabaseConnection.instance.connect();
    }

    return DatabaseConnection.instance.connection;
  }
}

module.exports = DatabaseConnection;
