
jest.mock('mysql2', () => ({
  createConnection: jest.fn()
}));

const mysql = require('mysql2');
const DatabaseConnection = require('../repo-temp/DatabaseConnection');

const mockConnection = {
  connect: jest.fn()
};

describe('DatabaseConnection Singleton Unit Tests', () => {

  beforeEach(() => {
    DatabaseConnection.instance = null;

    jest.clearAllMocks();

    mysql.createConnection.mockReturnValue(mockConnection);

    mockConnection.connect.mockImplementation((callback) => {
      callback(null);
    });
  });

  test('Should create only one database instance', () => {
    const firstInstance = new DatabaseConnection();
    const secondInstance = new DatabaseConnection();

    expect(firstInstance).toBe(secondInstance);
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
  });

  test('Should return the database connection using getInstance', () => {
    const connection = DatabaseConnection.getInstance();

    expect(connection).toBe(mockConnection);
  });

  test('Should reuse the same database connection', () => {
    const firstConnection = DatabaseConnection.getInstance();
    const secondConnection = DatabaseConnection.getInstance();

    expect(firstConnection).toBe(secondConnection);
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mockConnection.connect).toHaveBeenCalledTimes(1);
  });

});
