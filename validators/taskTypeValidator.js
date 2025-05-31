const { z } = require('zod');

const taskTypeSchema = z.object({
    name: z.string().min(1, 'Task Type Name is required'),
    description: z.string().optional(),
});

module.exports = { taskTypeSchema };