const { taskTypeSchema } = require('../validators/taskTypeValidator');
const prisma = require('../db');
const AppError = require('../utils/AppError');


exports.createTaskType = async (req,res,next) => {
    try {
        const data = taskTypeSchema.parse(req.body);

        const newTaskType = await prisma.taskType.create({ data });

        res.status(201).json({
            message: "status",
            data: newTaskType
        })
    } catch(err) {
        next(err);
    }
}


exports.getById = async (req,res,next) => {
    try{
        const taskType = await prisma.taskType.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                subTaskTypes: true
            }
        });

        if(!taskType) {
            throw new AppError('There\'s no Task Type with this id.', 404);
        }

        res.status(200).json({
            status: "success",
            data: taskType
        });

    } catch (err) {
        next(err);
    }
}