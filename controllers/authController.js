const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util')

const { createUserSchema, loginUserSchema } = require('../validators/userValidator');
const prisma = require('../db');
const AppError = require('../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });
}

const saveCookie = (token, res) => {
    const cookieOptions = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000)),
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions);
}

const sendAuthResponse = (user, res) => {
    const token = signToken(user.id);
    saveCookie(token, res);
    res.status(201).json({
        status: 'success',
        token: token,
        data: user
    });
}

const verifyPassword = async (inputPassword, userPassword) => {
    console.log('from verify password', await bcrypt.compare(inputPassword, userPassword));
    return await bcrypt.compare(inputPassword, userPassword);
}

exports.signup = async (req, res, next) => {
    try {
        const data = createUserSchema.parse(req.body);
        const newUser = await prisma.user.create({ data });

        sendAuthResponse(newUser.id, res);
    } catch (err) {
        next(err);
    }
}


exports.login = async (req, res, next) => {
    try {
        // Check if input has Full Name and Password
        const data = loginUserSchema.parse(req.body);

        // Check if user exists with given credentials
        const user = await prisma.user.findUnique({
            where: {
                fullName: data.fullName
            }
        });

        if (!user || !(await verifyPassword(data.password, user.password))) {
            return next(new AppError('Incorrect FullName or Password', 401));
        }

        // If ok, send JWT token to client
        sendAuthResponse(user, res);
    } catch (err) {
        next(err);
    }
}

exports.protectRoute = async (req, res, next) => {
    try {
        // Getting token and check if it's there
        let token;
        const headerAuth = req.headers.authorization;

        if (headerAuth && headerAuth.startsWith('Bearer')) {
            token = headerAuth.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('You\'re not logged in. Please log in to get access', 403));
        }

        // Verifying Token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Checking if user still exist in DB
        const currentUser = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!currentUser) {
            return next(new AppError(`The user belonging to this token does no longer exist`));
        }

        // Grant access to user
        req.user = currentUser;
        next();
    } catch (err) {
        next(err);
    }
}

exports.getCurrentUser = async (req, res, next) => {
    try {
        res.status(200).json({
            status: 'success',
            data: req.user
        });
    } catch (err) {
        next(err);
    }
}