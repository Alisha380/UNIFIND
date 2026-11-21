
const NotificationService = require('../repo-temp/NotificationService');

describe('NotificationService Unit Tests', () => {

  test('Should subscribe an observer', () => {
    const service = new NotificationService();
    const observer = jest.fn();

    service.subscribe(observer);

    expect(service.observers).toContain(observer);
  });

  test('Should notify all subscribed observers', () => {
    const service = new NotificationService();
    const observer1 = jest.fn();
    const observer2 = jest.fn();

    const report = {
      type: 'Lost',
      item_name: 'Wallet'
    };

    service.subscribe(observer1);
    service.subscribe(observer2);

    service.notify(report);

    expect(observer1).toHaveBeenCalledWith(report);
    expect(observer2).toHaveBeenCalledWith(report);
  });

  test('Should unsubscribe an observer', () => {
    const service = new NotificationService();
    const observer = jest.fn();

    service.subscribe(observer);
    service.unsubscribe(observer);

    expect(service.observers).not.toContain(observer);
  });

});
