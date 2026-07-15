const express = require('express');
const router = express.Router();
const multer = require('multer');
const carAdminController = require('../controllers/car.admin.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAdmin);

router.get('/', carAdminController.listCars);
router.post('/', carAdminController.createCar);
router.put('/:id', carAdminController.updateCar);
router.patch('/:id/status', carAdminController.changeStatus);
router.delete('/:id', carAdminController.deleteCar);

router.post('/:id/media', upload.array('files', 10), carAdminController.uploadMedia);
router.put('/:id/media/reorder', carAdminController.reorderMedia);

module.exports = router;
