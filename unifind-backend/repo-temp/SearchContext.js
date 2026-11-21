class SearchContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  executeSearch(items, value) {
    return this.strategy.search(items, value);
  }
}

module.exports = SearchContext;