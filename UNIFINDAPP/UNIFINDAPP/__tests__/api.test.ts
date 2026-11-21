
import { describe, test, expect, jest, afterEach } from '@jest/globals';
import { getItems, createReport, updateReport, deleteReport } from '../utils/api';

describe('API - Get Reports', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return reports when API request is successful', async () => {
    const mockReports = [
      { id: 1, item_name: 'Black Wallet', type: 'Lost' },
      { id: 2, item_name: 'Blue Bag', type: 'Found' },
    ];

    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockReports,
    } as Response);

    const result = await getItems('http://localhost:3000');

    expect(result).toEqual(mockReports);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/items'
    );
  });

  test('should throw error when API returns an unsuccessful response', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
    } as Response);

    await expect(
      getItems('http://localhost:3000')
    ).rejects.toThrow('Failed to fetch reports');
  });

  test('should throw error when network request fails', async () => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValue(
      new Error('Network error')
    );

    await expect(
      getItems('http://localhost:3000')
    ).rejects.toThrow('Network error');
  });
    test('should create a new report using POST request', async () => {
    const newReport = {
      name: 'Alisha',
      email: 'alisha@example.com',
      type: 'Lost',
      item_name: 'Black Wallet',
      location: 'Library',
      msg: 'Black wallet lost near library',
    };

    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 5, ...newReport }),
    } as Response);

    const result = await createReport(
      'http://localhost:3000',
      newReport
    );

    expect(result.ok).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/items',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReport),
      }
    );
  });

  test('should return unsuccessful response when report creation fails', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
    } as Response);

    const result = await createReport(
      'http://localhost:3000',
      { item_name: 'Test Item' }
    );

    expect(result.ok).toBe(false);
  });

  test('should update an existing report using PUT request', async () => {
    const updatedReport = {
      name: 'Alisha',
      email: 'alisha@example.com',
      type: 'Lost',
      item_name: 'Black Wallet',
      location: 'Library',
      msg: 'Updated description',
    };

    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
    } as Response);

    const result = await updateReport(
      'http://localhost:3000',
      5,
      updatedReport
    );

    expect(result.ok).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/items/5',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReport),
      }
    );
  });

  test('should delete an existing report using DELETE request', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
    } as Response);

    const result = await deleteReport(
      'http://localhost:3000',
      5
    );

    expect(result.ok).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/items/5',
      {
        method: 'DELETE',
      }
    );
  });

});
