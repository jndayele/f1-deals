const express = require('express');
const router = express.Router();
const carPublicController = require('../controllers/car.public.controller');
const { cacheMiddleware } = require('../middleware/cache.middleware');

router.get('/', cacheMiddleware('cache:cars', 300), carPublicController.listCars);
router.get('/:id', carPublicController.getCarDetail);

module.exports = router;
