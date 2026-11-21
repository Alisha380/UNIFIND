
const KeywordSearch = require('../repo-temp/KeywordSearch');

describe('KeywordSearch Unit Tests', () => {

  const search = new KeywordSearch();

  const items = [
    {
      item_name: 'Black Wallet',
      msg: 'Lost near library'
    },
    {
      item_name: 'Keys',
      msg: 'Found near cafeteria'
    },
    {
      item_name: 'Blue Bag',
      msg: 'Lost near classroom'
    }
  ];

  test('Should find report by item name', () => {
    const result = search.search(items, 'Wallet');

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('Black Wallet');
  });

  test('Should find report by description', () => {
    const result = search.search(items, 'cafeteria');

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('Keys');
  });

  test('Should perform case-insensitive search', () => {
    const result = search.search(items, 'WALLET');

    expect(result).toHaveLength(1);
  });

  test('Should return empty array when no match is found', () => {
    const result = search.search(items, 'Phone');

    expect(result).toEqual([]);
  });

});
