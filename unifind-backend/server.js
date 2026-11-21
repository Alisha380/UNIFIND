

const express = require('express');
const DatabaseConnection = require('./repo-temp/DatabaseConnection');
const cors = require('cors');
const path = require('path');

const ItemRepository = require('./repo-temp/ItemRepository');
const NotificationService = require('./repo-temp/NotificationService');

const ItemController = require('./controllers/ItemController');
const createItemRoutes = require('./routes/itemRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection (Singleton Pattern)
const db = DatabaseConnection.getInstance();

// Repository Pattern
const itemRepository = new ItemRepository(db);

// Observer Pattern
const notificationService = new NotificationService();

const reportObserver = (report) => {
  console.log(
    `Notification: New ${report.type} report - ${report.item_name}`
  );
};

notificationService.subscribe(reportObserver);

// MVC Controller
const itemController = new ItemController(
  itemRepository,
  notificationService
);

// Home Route
app.get('/', (req, res) => {
  res.send('<h1>Server is working perfectly!</h1>');
});

// MVC Routes
app.use('/items', createItemRoutes(itemController));

// Start Server
const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
