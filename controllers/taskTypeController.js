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
        next();
    }
}