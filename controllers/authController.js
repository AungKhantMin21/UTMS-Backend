const { createUserSchema } = require('../validators/userValidator');
const prisma = require('../db');

exports.signup = async (req,res,next) => {
    try {
        const data = createUserSchema.parse(req.body);
        
        const newUser = await prisma.user.create({ data });

        res.status(201).json({
            status: 'success',
            data: newUser
        });
    } catch(err) {
        next(err);
    }
}