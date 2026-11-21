
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Image storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// Only allow image files
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const createItemRoutes = (itemController) => {

  // Upload image
  router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = `http://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'Image uploaded successfully',
      image_url: imageUrl
    });
  });

  router.get('/', itemController.getAll);
  router.get('/search', itemController.search);
  router.post('/', itemController.create);
  router.delete('/:id', itemController.delete);
  router.put('/:id', itemController.update);

  return router;
};

module.exports = createItemRoutes;
