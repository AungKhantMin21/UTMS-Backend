const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');

router.route('/')
                .get(authController.protectRoute, taskController.getAll)
                .post(authController.protectRoute, taskController.createNew);

router.route('/:id')
                .get(authController.protectRoute, taskController.getById)
                .put(authController.protectRoute, taskController.updateById);;

module.exports = router;