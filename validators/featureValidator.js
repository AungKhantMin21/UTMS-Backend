const { z } = require('zod');

const featureSchema = z.object({
    moduleName: z.string().min(1, 'Module Name is required')
});

module.exports = { featureSchema };