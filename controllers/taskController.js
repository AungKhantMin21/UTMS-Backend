const { taskSchema, updateTaskSchema } = require('../validators/taskValidator');
const prisma = require('../db');
const AppError = require('../utils/AppError');

const calculateSla = (startTime, estHours, priority) => {
    const priorityMap = {
        URGENT: 0.5,
        HIGH: 0.8,
        MEDIUM: 1.0,
        LOW: 1.2
    };

    return startTime + (estHours * priorityMap[priority]) * 60 * 60 * 1000;
}

exports.createNew = async (req, res, next) => {
    try {
        const data = taskSchema.parse(req.body);

        const taskType = await prisma.taskType.findUnique({
            where: {
                name: data.taskType
            }
        });

        if (!taskType) {
            throw new AppError('There\'s no Task Type with this name.', 404);
        }

        const subTaskType = await prisma.subTaskType.findUnique({
            where: {
                taskTypeId_name:{
                    taskTypeId: taskType.id,
                    name: data.subTaskType
                }
            }
        });

        if (!subTaskType) {
            throw new AppError('There\'s no Sub Task Type with this name.', 404);
        }

        const feature = await prisma.featureModule.findUnique({
            where: {
                moduleName: data.feature
            }
        });

        if (!feature) {
            throw new AppError('There\'s no Feature Module with this name.', 404);
        }



        const newTask = await prisma.task.create({
            data: {
                ...(data.description !== undefined && { description: data.description }),
                taskTypeId: taskType.id,
                subTaskTypeId: subTaskType.id,
                moduleId: feature.id,
                assigneeUserId: req.user.id,
                priority: data.priority,
                dueDate: new Date(calculateSla(Date.now(), subTaskType.estimatedHours, data.priority)),
            }
        });

        res.status(201).json({
            message: "status",
            data: newTask
        });
    } catch (err) {
        next(err);
    }
}


exports.getById = async (req,res,next) => {
    try{
        const task = await prisma.task.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                taskType: true,
                subTaskType: true,
                module: true,
                assignee: true
            }
        });

        if(!task) {
            throw new AppError('There\'s no Task with this id.', 404);
        }

        res.status(200).json({
            status: "success",
            data: task
        });

    } catch (err) {
        next(err);
    }
}


exports.getAll = async (req,res,next) => {
    try{
        const allTasks = await prisma.task.findMany({
            include:{
                taskType: {
                    select: { name: true}
                },
                subTaskType: {
                    select: { name: true}
                },
                module: {
                    select: { moduleName: true}
                },
                assignee: {
                    select: { fullName: true}
                }
            }
        });

        res.status(200).json({
            status: "success",
            count: allTasks.length,
            data: allTasks
        });
    } catch(err) {
        next(err);
    }
}


exports.updateById = async (req,res,next) => {
    try {
        const data = updateTaskSchema.parse(req.body);

        const task = await prisma.task.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                subTaskType: {
                    select: {
                        estimatedHours: true
                    }
                }
            }
        });

        if(!task){
            throw new AppError('There\'s no Task with this id.', 404);
        }


        const updateTask = await prisma.task.update({
            where: {
                id: req.params.id
            },
            data: {
                ...(data.description !== undefined && data.description !== task.description && { description: data.description }),
                status: data.status,
                ...(data.status === 'RESOLVED' && { completionDate: new Date()}),
                priority: data.priority,
                ...(data.priority !== task.priority && { 
                    dueDate: new Date(calculateSla(task.createdAt.getTime(), task.subTaskType.estimatedHours, data.priority))
                }),
            },
            include:{
                taskType: {
                    select: { name: true}
                },
                subTaskType: {
                    select: { name: true}
                },
                module: {
                    select: { moduleName: true}
                },
                assignee: {
                    select: { fullName: true}
                }
            }
        });

        res.status(201).json({
            message: "status",
            data: updateTask
        })
    } catch(err) {
        next(err);
    }
}