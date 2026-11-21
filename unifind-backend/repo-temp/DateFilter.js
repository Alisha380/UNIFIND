
const SearchStrategy = require('./SearchStrategy');

class DateFilter extends SearchStrategy {
  search(items, date) {
    return items.filter((item) => {
      if (!item.created_at) return false;

      const itemDate = new Date(item.created_at)
        .toISOString()
        .split('T')[0];

      return itemDate === date;
    });
  }
}

module.exports = DateFilter;