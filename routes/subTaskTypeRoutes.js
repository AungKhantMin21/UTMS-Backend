const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const subTaskTypeController = require('../controllers/subTaskTypeController');


router.route('/')
                .get(authController.protectRoute, subTaskTypeController.getAll)
                .post(authController.protectRoute, authController.allowOnly('ADMIN'), subTaskTypeController.createNew);


router.route('/:id')
                    .get(authController.protectRoute, subTaskTypeController.getById)
                    .put(authController.protectRoute, subTaskTypeController.updateById)
                    .delete(authController.protectRoute, subTaskTypeController.deleteById);

module.exports = router;