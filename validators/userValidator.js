const { z } = require('zod');

const createUserSchema = z.object({
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    passwordConfirm: z.string().min(6, 'Confirm Password must be at least 6 characters'),
    userType: z.enum(['SUPPORT', 'ADMIN', 'PRODUCT_MANAGER'])
}).refine(data => data.password === data.passwordConfirm, {
    message: 'Passwords don\'t matched'
});


module.exports = { createUserSchema };