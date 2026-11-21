
const Item = require('../models/Item');

describe('Item Model Unit Tests', () => {

  test('Should create an item with all properties', () => {
    const data = {
      id: 1,
      type: 'Lost',
      name: 'Alisha',
      item_name: 'Wallet',
      category: 'Accessories',
      location: 'Library',
      email: 'test@gmail.com',
      msg: 'Black wallet',
      image_url: 'wallet.jpg',
      created_at: '2026-11-21T10:30:00.000Z'
    };

    const item = new Item(data);

    expect(item.id).toBe(1);
    expect(item.type).toBe('Lost');
    expect(item.name).toBe('Alisha');
    expect(item.item_name).toBe('Wallet');
    expect(item.category).toBe('Accessories');
    expect(item.location).toBe('Library');
    expect(item.email).toBe('test@gmail.com');
    expect(item.msg).toBe('Black wallet');
    expect(item.image_url).toBe('wallet.jpg');
    expect(item.created_at).toBe('2026-11-21T10:30:00.000Z');
  });

  test('Should preserve missing properties as undefined', () => {
    const item = new Item({ id: 2 });

    expect(item.id).toBe(2);
    expect(item.type).toBeUndefined();
    expect(item.item_name).toBeUndefined();
    expect(item.location).toBeUndefined();
  });

});
