const Item = require('../models/Item');
const ReportFactory = require('../repo-temp/ReportFactory');
const SearchContext = require('../repo-temp/SearchContext');

const KeywordSearch = require('../repo-temp/KeywordSearch');
const CategoryFilter = require('../repo-temp/CategoryFilter');
const DateFilter = require('../repo-temp/DateFilter');
const LocationFilter = require('../repo-temp/LocationFilter');

class ItemController {
  constructor(itemRepository, notificationService) {
    this.itemRepository = itemRepository;
    this.notificationService = notificationService;
  }

  getAll = async (req, res) => {
    try {
      const results = await this.itemRepository.getAll();
      res.json(results.map(item => new Item(item)));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Data fetch nahi ho saka' });
    }
  };

  search = async (req, res) => {
    try {
      const items = (await this.itemRepository.getAll())
        .map(item => new Item(item));

      const { keyword, category, date, location } = req.query;

      let context;
      let value;

      if (keyword) {
        context = new SearchContext(new KeywordSearch());
        value = keyword;
      } else if (category) {
        context = new SearchContext(new CategoryFilter());
        value = category;
      } else if (date) {
        context = new SearchContext(new DateFilter());
        value = date;
      } else if (location) {
        context = new SearchContext(new LocationFilter());
        value = location;
      } else {
        return res.status(400).json({
          message: 'Please provide a search filter.'
        });
      }

      res.json(context.executeSearch(items, value));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Search failed.' });
    }
  };

  create = async (req, res) => {
    try {
      const report = ReportFactory.createReport(req.body);
      const newId = await this.itemRepository.create(report);

      this.notificationService.notify(report);

      res.status(200).json({
        message: 'Report successfully saved!',
        id: newId
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const affectedRows = await this.itemRepository.deleteById(req.params.id);

      if (affectedRows > 0) {
        res.json({ message: 'Report deleted successfully!' });
      } else {
        res.status(404).json({ message: 'Record not found in database' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  };

  update = async (req, res) => {
    try {
      const affectedRows = await this.itemRepository.updateById(
        req.params.id,
        req.body
      );

      if (affectedRows > 0) {
        res.json({ message: 'Report updated successfully!' });
      } else {
        res.status(404).json({
          message: 'No record found or no changes made'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Update failed' });
    }
  };
}

module.exports = ItemController;