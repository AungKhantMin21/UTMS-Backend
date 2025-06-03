const express = require('express');
const router = express.Router();


const authController = require('../controllers/authController');
const featureController = require('../controllers/featureController');

router.route('/')
                .get(authController.protectRoute, featureController.getAll)
                .post(authController.protectRoute, authController.allowOnly('ADMIN'), featureController.createNew);

router.route('/:id')
                    .get(authController.protectRoute, featureController.getById)
                    .put(authController.protectRoute, featureController.updateById)
                    .delete(authController.protectRoute, featureController.deleteById);

module.exports = router;