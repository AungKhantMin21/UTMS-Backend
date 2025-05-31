const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const taskTypeController = require('../controllers/taskTypeController');

router.route('/')
                .get(authController.protectRoute, taskTypeController.getAll)
                .post(authController.protectRoute, authController.allowOnly('ADMIN'), taskTypeController.createTaskType);

router.route('/:id')
                    .get(authController.protectRoute, taskTypeController.getById)
                    .put(authController.protectRoute,taskTypeController.updateById)
                    .delete(authController.protectRoute,taskTypeController.deleteById);

module.exports = router;