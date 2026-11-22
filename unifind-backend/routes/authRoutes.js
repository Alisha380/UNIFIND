const express = require('express');

const createAuthRoutes = (authController) => {
  const router = express.Router();

  router.post('/signup', authController.signup);
  router.post('/login', authController.login);

  return router;
};

module.exports = createAuthRoutes;
