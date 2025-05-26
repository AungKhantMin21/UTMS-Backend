const jwt = require('jsonwebtoken');

const { createUserSchema } = require('../validators/userValidator');
const prisma = require('../db');

const signToken = (id) => {
    return jwt.sign({id: id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE_IN
    });
}

const saveCookie = (token,res) => {
    const cookieOptions = {
        expires: new Date( Date.now() + (process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000)),
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions);
}

exports.signup = async (req,res,next) => {
    try {
        const data = createUserSchema.parse(req.body);
        const newUser = await prisma.user.create({ data });

        const token = signToken(newUser.id);
        saveCookie(token,res);
        res.status(201).json({
            status: 'success',
            token: token,
            data: newUser
        });
    } catch(err) {
        next(err);
    }
}