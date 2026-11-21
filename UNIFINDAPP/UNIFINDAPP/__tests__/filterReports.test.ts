import { describe, test, expect } from '@jest/globals';
import { filterReports } from '../utils/filterReports';

const reports = [
  { id: 1, item_name: 'Black Wallet', location: 'Cafeteria', type: 'Lost' },
  { id: 2, item_name: 'Blue Bag', location: 'Library', type: 'Found' },
  { id: 3, item_name: 'Mobile Phone', location: 'Classroom', type: 'Lost' },
  { id: 4, item_name: 'Laptop', location: 'Library', type: 'Found' },
];

describe('Report Search and Filter', () => {
  test('should search reports by item name', () => {
    const result = filterReports(reports, 'wallet', 'All');

    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('Black Wallet');
  });

  test('should search reports by location', () => {
    const result = filterReports(reports, 'library', 'All');

    expect(result).toHaveLength(2);
  });

  test('should filter Lost reports', () => {
    const result = filterReports(reports, '', 'Lost');

    expect(result).toHaveLength(2);
    expect(result.every(item => item.type === 'Lost')).toBe(true);
  });

  test('should filter Found reports', () => {
    const result = filterReports(reports, '', 'Found');

    expect(result).toHaveLength(2);
    expect(result.every(item => item.type === 'Found')).toBe(true);
  });

  test('should show all reports when filter is All', () => {
    const result = filterReports(reports, '', 'All');

    expect(result).toHaveLength(4);
  });

  test('should return empty array when no report matches', () => {
    const result = filterReports(reports, 'shoes', 'All');

    expect(result).toHaveLength(0);
  });

  test('should search without case sensitivity', () => {
    const result = filterReports(reports, 'WALLET', 'All');

    expect(result).toHaveLength(1);
  });
});