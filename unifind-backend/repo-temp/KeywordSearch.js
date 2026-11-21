
const SearchStrategy = require('./SearchStrategy');

class KeywordSearch extends SearchStrategy {
  search(items, keyword) {
    return items.filter((item) =>
      item.item_name.toLowerCase().includes(keyword.toLowerCase()) ||
      (item.msg || '').toLowerCase().includes(keyword.toLowerCase())
    );
  }
}

module.exports = KeywordSearch;
