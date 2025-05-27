const { z } = require('zod');

const baseUserSchema = z.object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    passwordConfirm: z.string().min(6, 'Confirm Password must be at least 6 characters'),
    userType: z.enum(['SUPPORT', 'ADMIN', 'PRODUCT_MANAGER'])
});

const createUserSchema = baseUserSchema.refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords don\'t matched'
});

const loginUserSchema = baseUserSchema.pick({
    fullName: true,
    password: true
});

module.exports = { createUserSchema, loginUserSchema };