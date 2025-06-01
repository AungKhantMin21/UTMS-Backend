const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const subTaskTypeController = require('../controllers/subTaskTypeController');


router.route('/')
                .post(authController.protectRoute, authController.allowOnly('ADMIN'), subTaskTypeController.createNew);


module.exports = router;