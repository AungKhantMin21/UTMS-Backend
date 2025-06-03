const { z } = require('zod');

const taskSchema = z.object({
    description: z.string().optional(),
    taskType: z.string().min(1, 'Task Type Name is required'),
    subTaskType: z.string().min(1, 'Sub Task Type Name is required'),
    feature: z.string().min(1, 'Feature Module Name is required'),
    priority: z.string(z.enum(['URGENT', 'LOW', 'MEDIUM', 'HIGH' ]))
});

module.exports = { taskSchema };