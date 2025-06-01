const { subTaskTypeSchema } = require('../validators/subTaskTypeValidator');
const prisma = require('../db');
const AppError = require('../utils/AppError');

exports.createNew = async (req, res, next) => {
    try {
        const data = subTaskTypeSchema.parse(req.body);

        const taskType = await prisma.taskType.findUnique({
            where: {
                name: data.taskType
            }
        });

        if(!taskType){
            throw new AppError('There\'s no Task Type with this name.', 404);
        }

        const newSubTaskType = await prisma.subTaskType.create({ 
            data: {
                name: data.name,
                ...(data.description !== undefined && { description: data.description }),
                estimatedHours: data.estimatedHours,
                taskTypeId: taskType.id
            }
         });

        res.status(201).json({
            message: "status",
            data: newSubTaskType
        })
    } catch (err) {
        next(err);
    }
}