const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');

router.route('/')
                .post(authController.protectRoute, taskController.createNew);

module.exports = router;