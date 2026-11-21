
const SearchContext = require('../repo-temp/SearchContext');

describe('SearchContext Unit Tests', () => {
  const items = [
    { item_name: 'Wallet' },
    { item_name: 'Keys' }
  ];

  test('Should execute the initial search strategy', () => {
    const strategy = {
      search: jest.fn().mockReturnValue([items[0]])
    };

    const context = new SearchContext(strategy);
    const result = context.executeSearch(items, 'Wallet');

    expect(result).toEqual([items[0]]);
    expect(strategy.search).toHaveBeenCalledWith(items, 'Wallet');
  });

  test('Should change the search strategy', () => {
    const firstStrategy = {
      search: jest.fn().mockReturnValue([])
    };

    const secondStrategy = {
      search: jest.fn().mockReturnValue([items[1]])
    };

    const context = new SearchContext(firstStrategy);
    context.setStrategy(secondStrategy);

    const result = context.executeSearch(items, 'Keys');

    expect(result).toEqual([items[1]]);
    expect(secondStrategy.search).toHaveBeenCalledWith(items, 'Keys');
  });

  test('Should return the result of selected strategy', () => {
    const strategy = {
      search: jest.fn().mockReturnValue(items)
    };

    const context = new SearchContext(strategy);
    const result = context.executeSearch(items, '');

    expect(result).toEqual(items);
  });
});
