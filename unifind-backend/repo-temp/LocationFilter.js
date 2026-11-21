const SearchStrategy = require('./SearchStrategy');

class LocationFilter extends SearchStrategy {
  search(items, location) {
    return items.filter((item) =>
      (item.location || '')
        .toLowerCase()
        .includes(location.toLowerCase())
    );
  }
}

module.exports = LocationFilter;