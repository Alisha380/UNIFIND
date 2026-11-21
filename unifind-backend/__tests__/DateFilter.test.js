
const DateFilter = require('../repo-temp/DateFilter');

describe('DateFilter Unit Tests', () => {
  const filter = new DateFilter();

  const items = [
    {
      item_name: 'Wallet',
      created_at: '2026-11-21T10:30:00.000Z'
    },
    {
      item_name: 'Keys',
      created_at: '2026-11-20T15:00:00.000Z'
    },
    {
      item_name: 'Laptop',
      created_at: '2026-11-21T18:00:00.000Z'
    },
    {
      item_name: 'Bottle'
    }
  ];

  test('Should find reports created on the given date', () => {
    const result = filter.search(items, '2026-11-21');

    expect(result).toHaveLength(2);
    expect(result[0].item_name).toBe('Wallet');
  });

  test('Should return empty array when no report matches the date', () => {
    const result = filter.search(items, '2026-11-19');

    expect(result).toEqual([]);
  });

  test('Should ignore reports with missing created_at', () => {
    const result = filter.search(items, '2026-11-21');

    expect(result.some(item => item.item_name === 'Bottle')).toBe(false);
  });
});
