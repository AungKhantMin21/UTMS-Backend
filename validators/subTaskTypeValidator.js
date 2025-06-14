const { z } = require('zod');

const subTaskTypeSchema = z.object({
    name: z.string().min(1, 'Sub Task Type Name is required'),
    description: z.string().optional(),
    estimatedHours: z.number(),
    taskType: z.string().min(1, 'Task Type Name is required')
});

const updateSubTaskTypeSchema = subTaskTypeSchema.pick({
    name: true,
    description: true,
    estimatedHours: true
});

module.exports = { subTaskTypeSchema, updateSubTaskTypeSchema };