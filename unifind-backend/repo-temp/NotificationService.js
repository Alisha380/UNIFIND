
class NotificationService {
  constructor() {
    this.observers = [];
  }

  // Register an observer
  subscribe(observer) {
    this.observers.push(observer);
  }

  // Remove an observer
  unsubscribe(observer) {
    this.observers = this.observers.filter(
      (item) => item !== observer
    );
  }

  // Notify all registered observers
  notify(report) {
    this.observers.forEach((observer) => {
      observer(report);
    });
  }
}

module.exports = NotificationService;
