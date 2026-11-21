import { describe, test, expect } from '@jest/globals';
import { validateReportForm } from '../utils/validation';

describe('Report Form Validation', () => {

  test('should reject empty form', () => {
    const result = validateReportForm({
      name: '',
      email: '',
      msg: '',
    });

    expect(result.name).toBe('Name is required');
    expect(result.email).toBe('Email is required');
    expect(result.msg).toBe('Description is required');
  });

  test('should reject invalid email', () => {
    const result = validateReportForm({
      name: 'Alisha',
      email: 'invalidemail',
      msg: 'Black wallet lost',
    });

    expect(result.email).toBe('Invalid email format');
  });

  test('should accept valid form', () => {
    const result = validateReportForm({
      name: 'Alisha',
      email: 'alisha@example.com',
      msg: 'Black wallet lost',
    });

    expect(result).toEqual({});
  });

});