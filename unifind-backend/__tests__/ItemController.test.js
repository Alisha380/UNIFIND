
const ItemController = require('../controllers/ItemController');

describe('ItemController Unit Tests', () => {
  let repository;
  let notificationService;
  let controller;
  let req;
  let res;

  beforeEach(() => {
    repository = {
      getAll: jest.fn(),
      create: jest.fn(),
      deleteById: jest.fn(),
      updateById: jest.fn()
    };

    notificationService = {
      notify: jest.fn()
    };

    controller = new ItemController(
      repository,
      notificationService
    );

    req = {
      body: {},
      query: {},
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Should fetch all reports successfully', async () => {
    const reports = [
      { id: 1, type: 'Lost', item_name: 'Wallet' },
      { id: 2, type: 'Found', item_name: 'Keys' }
    ];

    repository.getAll.mockResolvedValue(reports);

    await controller.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(reports);
  });

  test('Should return 500 when fetching reports fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    repository.getAll.mockRejectedValue(new Error('Database error'));

    await controller.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('Should search reports by keyword', async () => {
    const reports = [
      { id: 1, item_name: 'Black Wallet', msg: 'Lost item' },
      { id: 2, item_name: 'Keys', msg: 'Found item' }
    ];

    repository.getAll.mockResolvedValue(reports);
    req.query.keyword = 'Wallet';

    await controller.search(req, res);

    expect(res.json).toHaveBeenCalledWith([reports[0]]);
  });
  test('Should search reports by category', async () => {
    const reports = [
      { id: 1, item_name: 'Wallet', category: 'Accessories' },
      { id: 2, item_name: 'Laptop', category: 'Electronics' }
    ];

    repository.getAll.mockResolvedValue(reports);
    req.query.category = 'Accessories';

    await controller.search(req, res);

    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        item_name: 'Wallet',
        category: 'Accessories'
      })
    ]);
  });

  test('Should search reports by date', async () => {
    const reports = [
      {
        id: 1,
        item_name: 'Wallet',
        created_at: '2026-11-21T10:30:00.000Z'
      },
      {
        id: 2,
        item_name: 'Keys',
        created_at: '2026-11-20T10:30:00.000Z'
      }
    ];

    repository.getAll.mockResolvedValue(reports);
    req.query.date = '2026-11-21';

    await controller.search(req, res);

    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        item_name: 'Wallet'
      })
    ]);
  });

  test('Should search reports by location', async () => {
    const reports = [
      { id: 1, item_name: 'Wallet', location: 'Main Library' },
      { id: 2, item_name: 'Keys', location: 'Cafeteria' }
    ];

    repository.getAll.mockResolvedValue(reports);
    req.query.location = 'Library';

    await controller.search(req, res);

    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        item_name: 'Wallet',
        location: 'Main Library'
      })
    ]);
  });
  test('Should return 400 when no search filter is provided', async () => {
    repository.getAll.mockResolvedValue([]);

    await controller.search(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Please provide a search filter.'
    });
  });

  test('Should create a new report and send notification', async () => {
    req.body = {
      type: 'Lost',
      name: 'Alisha',
      item_name: 'Wallet',
      location: 'Library',
      email: 'test@gmail.com',
      msg: 'Black wallet',
      image_url: ''
    };

    repository.create.mockResolvedValue(10);

    await controller.create(req, res);

    expect(repository.create).toHaveBeenCalled();
    expect(notificationService.notify).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Report successfully saved!',
      id: 10
    });
  });

  test('Should return 400 for invalid report type', async () => {
    req.body = { type: 'Unknown' };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(notificationService.notify).not.toHaveBeenCalled();
  });

  test('Should delete an existing report', async () => {
    req.params.id = '5';
    repository.deleteById.mockResolvedValue(1);

    await controller.delete(req, res);

    expect(repository.deleteById).toHaveBeenCalledWith('5');
    expect(res.json).toHaveBeenCalledWith({
      message: 'Report deleted successfully!'
    });
  });

  test('Should return 404 when report is not found for deletion', async () => {
    req.params.id = '99';
    repository.deleteById.mockResolvedValue(0);

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('Should update an existing report', async () => {
    req.params.id = '5';
    req.body = { item_name: 'Updated Wallet' };

    repository.updateById.mockResolvedValue(1);

    await controller.update(req, res);

    expect(repository.updateById).toHaveBeenCalledWith(
      '5',
      req.body
    );

    expect(res.json).toHaveBeenCalledWith({
      message: 'Report updated successfully!'
    });
  });
  test('Should return 500 when search fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    repository.getAll.mockRejectedValue(new Error('Database error'));
    req.query.keyword = 'Wallet';

    await controller.search(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Search failed.'
    });
  });

  test('Should return 500 when report deletion fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    repository.deleteById.mockRejectedValue(new Error('Database error'));
    req.params.id = '5';

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Database error'
    });
  });

  test('Should return 500 when report update fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    repository.updateById.mockRejectedValue(new Error('Database error'));
    req.params.id = '5';

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Update failed'
    });
  });

  test('Should return 400 when report creation fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    req.body = {
      type: 'Lost',
      name: 'Alisha',
      item_name: 'Wallet'
    };

    repository.create.mockRejectedValue(new Error('Database error'));

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Database error'
    });
  });
  test('Should return 404 when report is not found for update', async () => {
    req.params.id = '99';
    repository.updateById.mockResolvedValue(0);

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
