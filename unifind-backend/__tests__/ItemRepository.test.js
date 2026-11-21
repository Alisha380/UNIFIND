
const ItemRepository = require('../repo-temp/ItemRepository');

describe('ItemRepository Unit Tests', () => {

  let db;
  let repository;

  beforeEach(() => {
    db = {
      query: jest.fn()
    };

    repository = new ItemRepository(db);
  });

  test('Should fetch all reports from database', async () => {
    const reports = [
      { id: 1, type: 'Lost', item_name: 'Wallet' },
      { id: 2, type: 'Found', item_name: 'Keys' }
    ];

    db.query.mockImplementation((sql, callback) => {
      callback(null, reports);
    });

    const result = await repository.getAll();

    expect(result).toEqual(reports);
    expect(db.query).toHaveBeenCalled();
  });

  test('Should create a new report', async () => {
    db.query.mockImplementation((sql, values, callback) => {
      callback(null, { insertId: 5 });
    });

    const report = {
      type: 'Lost',
      name: 'Alisha',
      item_name: 'Wallet',
      location: 'Library',
      email: 'test@gmail.com',
      msg: 'Black wallet',
      image_url: ''
    };

    const result = await repository.create(report);

    expect(result).toBe(5);
    expect(db.query).toHaveBeenCalled();
  });

  test('Should delete a report by ID', async () => {
    db.query.mockImplementation((sql, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const result = await repository.deleteById(5);

    expect(result).toBe(1);
  });

  test('Should update an existing report', async () => {
    db.query.mockImplementation((sql, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const updatedData = {
      item_name: 'Updated Wallet',
      location: 'Cafeteria',
      category: 'Accessories',
      type: 'Lost',
      msg: 'Updated description'
    };

    const result = await repository.updateById(5, updatedData);

    expect(result).toBe(1);
  });

});
