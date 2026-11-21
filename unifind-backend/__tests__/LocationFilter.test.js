
const LocationFilter = require('../repo-temp/LocationFilter');

describe('LocationFilter Unit Tests', () => {
  const filter = new LocationFilter();

  const items = [
    { item_name: 'Wallet', location: 'Main Library' },
    { item_name: 'Keys', location: 'Cafeteria' },
    { item_name: 'Laptop', location: 'Computer Lab' },
    { item_name: 'Bottle' }
  ];

  test('Should find reports by exact location', () => {
    const result = filter.search(items, 'Cafeteria');

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('Keys');
  });

  test('Should find reports by partial location', () => {
    const result = filter.search(items, 'Library');

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('Wallet');
  });

  test('Should perform case-insensitive location search', () => {
    const result = filter.search(items, 'cafeteria');

    expect(result).toHaveLength(1);
  });

  test('Should return empty array when location does not match', () => {
    const result = filter.search(items, 'Parking');

    expect(result).toEqual([]);
  });
});
