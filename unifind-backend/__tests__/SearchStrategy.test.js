
const SearchStrategy = require('../repo-temp/SearchStrategy');

describe('SearchStrategy Unit Tests', () => {
  test('Should throw error when search method is not implemented', () => {
    const strategy = new SearchStrategy();

    expect(() => strategy.search([], 'Wallet'))
      .toThrow('Search method must be implemented');
  });

  test('Should allow child classes to implement search method', () => {
    class CustomSearch extends SearchStrategy {
      search(items, keyword) {
        return items.filter(item =>
          item.item_name.includes(keyword)
        );
      }
    }

    const strategy = new CustomSearch();
    const items = [
      { item_name: 'Wallet' },
      { item_name: 'Keys' }
    ];

    const result = strategy.search(items, 'Wallet');

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('Wallet');
  });
});
