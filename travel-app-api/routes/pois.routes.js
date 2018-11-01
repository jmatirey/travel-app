const express = require('express');
const router = express.Router();
const pois = require('../controllers/pois.controller');
const Poi = require('../models/poi.model');

const uploader = require('../config/multer.config');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/list', pois.list);

router.post(
  '/', 
  authMiddleware.isAuthenticated,
  uploader.array('file'),
  pois.create
);


router.get('/:id', pois.detail);

router.post(
  '/:id',
  authMiddleware.isOwner(Poi),
  uploader.array('file'),
  pois.edit
);

module.exports = router;
