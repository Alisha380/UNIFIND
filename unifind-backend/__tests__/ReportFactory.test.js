
const ReportFactory = require('../repo-temp/ReportFactory');

describe('ReportFactory Unit Tests', () => {

  test('Should create a Lost report', () => {
    const data = {
      type: 'Lost',
      name: 'Alisha',
      item_name: 'Wallet',
      location: 'Library',
      email: 'test@gmail.com',
      msg: 'Black wallet',
      image_url: ''
    };

    const report = ReportFactory.createReport(data);

    expect(report.type).toBe('Lost');
    expect(report.item_name).toBe('Wallet');
  });

  test('Should create a Found report', () => {
    const data = {
      type: 'Found',
      name: 'Alisha',
      item_name: 'Keys',
      location: 'Cafeteria',
      email: 'test@gmail.com',
      msg: 'Found keys',
      image_url: ''
    };

    const report = ReportFactory.createReport(data);

    expect(report.type).toBe('Found');
    expect(report.item_name).toBe('Keys');
  });

  test('Should throw error for invalid report type', () => {
    const data = {
      type: 'Unknown'
    };

    expect(() => ReportFactory.createReport(data))
      .toThrow('Invalid report type');
  });

});
