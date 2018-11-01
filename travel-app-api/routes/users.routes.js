const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploader = require('../config/multer.config');

router.post('/',
  users.create
);
router.get('/:id', 
  authMiddleware.isAuthenticated,
  users.detail
);

router.post(
  '/:id',
  // authMiddleware.isMe,
  uploader.single('image'),
  users.edit
);

module.exports = router;
