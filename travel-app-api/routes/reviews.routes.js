const express = require('express');
const router = express.Router();
const reviews = require('../controllers/reviews.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
  '/:id', 
  authMiddleware.isAuthenticated,
  reviews.create
);
router.get('/:id/list', reviews.list);

module.exports = router;
