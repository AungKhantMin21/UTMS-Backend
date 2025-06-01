const { subTaskTypeSchema, updateSubTaskTypeSchema } = require('../validators/subTaskTypeValidator');
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


exports.getById = async (req,res,next) => {
    try{
        const subTaskType = await prisma.subTaskType.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                taskType: true
            }
        });

        if(!subTaskType) {
            throw new AppError('There\'s no Sub Task Type with this id.', 404);
        }

        res.status(200).json({
            status: "success",
            data: subTaskType
        });

    } catch (err) {
        next(err);
    }
}



exports.getAll = async (req,res,next) => {
    try{
        const allSubTaskTypes = await prisma.subTaskType.findMany({
            include: {
                taskType: true
            }
        });

        res.status(200).json({
            status: "success",
            count: allSubTaskTypes.length,
            data: allSubTaskTypes
        });
    } catch(err) {
        next(err);
    }
}


exports.updateById = async (req,res,next) => {
    try {
        const data = updateSubTaskTypeSchema.parse(req.body);

        const updateSubTaskType = await prisma.subTaskType.update({
            where: {
                id: req.params.id
            },
            data: { 
                name: data.name,
                ...(data.description !== undefined && { description: data.description }),
                estimatedHours: data.estimatedHours
            }
        });

        res.status(201).json({
            message: "status",
            data: updateSubTaskType
        })
    } catch(err) {
        next(err);
    }
}


exports.deleteById = async (req,res,next) => {
    try {
        const deleteSubTaskType = await prisma.subTaskType.delete({
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