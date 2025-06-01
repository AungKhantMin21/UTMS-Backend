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


exports.getAll = async (req,res,next) => {
    try{
        const allTaskTypes = await prisma.taskType.findMany({
            include: {
                subTaskTypes: true
            }
        });

        res.status(200).json({
            status: "success",
            count: allTaskTypes.length,
            data: allTaskTypes
        });
    } catch(err) {
        next(err);
    }
}


exports.updateById = async (req,res,next) => {
    try {
        const data = taskTypeSchema.parse(req.body);

        const updateTaskType = await prisma.taskType.update({
            where: {
                id: req.params.id
            },
            data: { 
                name: data.name,
                ...(data.description !== undefined && { description: data.description })
            }
        });

        res.status(201).json({
            message: "status",
            data: updateTaskType
        })
    } catch(err) {
        next(err);
    }
}


exports.deleteById = async (req,res,next) => {
    try {
        const deleteTaskType = await prisma.taskType.delete({
            where: {
                id: req.params.id
            }
        });
        
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch(err) {
        next(err);
    }
}