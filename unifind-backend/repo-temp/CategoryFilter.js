const SearchStrategy = require('./SearchStrategy');

class CategoryFilter extends SearchStrategy {
  search(items, category) {
    return items.filter((item) =>
      (item.category || '').toLowerCase() === category.toLowerCase()
    );
  }
}

module.exports = CategoryFilter;