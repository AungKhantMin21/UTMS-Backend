const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const taskTypeController = require('../controllers/taskTypeController');

router.post('/',authController.protectRoute,
                authController.allowOnly('ADMIN'),
                taskTypeController.createTaskType);

router.get('/:id',  authController.protectRoute,
                    taskTypeController.getById);

module.exports = router;