
const CategoryFilter = require('../repo-temp/CategoryFilter');

describe('CategoryFilter Unit Tests', () => {
  const filter = new CategoryFilter();

  const items = [
    { item_name: 'Wallet', category: 'Accessories' },
    { item_name: 'Laptop', category: 'Electronics' },
    { item_name: 'Keys', category: 'Accessories' },
    { item_name: 'Bottle' }
  ];

  test('Should find reports by category', () => {
    const result = filter.search(items, 'Accessories');

    expect(result).toHaveLength(2);
    expect(result[0].item_name).toBe('Wallet');
  });

  test('Should perform case-insensitive category matching', () => {
    const result = filter.search(items, 'accessories');

    expect(result).toHaveLength(2);
  });

  test('Should return empty array when category does not match', () => {
    const result = filter.search(items, 'Clothing');

    expect(result).toEqual([]);
  });

  test('Should handle reports with missing category', () => {
    const result = filter.search(items, '');

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('Bottle');
  });
});
