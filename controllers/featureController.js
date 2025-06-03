const slugify = require('slugify');

const { featureSchema } = require('../validators/featureValidator');
const prisma = require('../db');
const AppError = require('../utils/AppError');


exports.createNew = async (req,res,next) => {
    try {
        const data = featureSchema.parse(req.body);

        const newFeature = await prisma.featureModule.create({
            data: {
                moduleName: data.moduleName,
                tag: slugify(data.moduleName, { replacement: '_', lower: true })
            }
        });

        res.status(201).json({
            message: "status",
            data: newFeature
        })
    } catch(err) {
        next(err);
    }
}


exports.getById = async (req,res,next) => {
    try{
        const feature = await prisma.featureModule.findUnique({
            where: {
                id: req.params.id
            }
        });

        if(!feature) {
            throw new AppError('There\'s no Feature with this id.', 404);
        }

        res.status(200).json({
            status: "success",
            data: feature
        });
    } catch (err) {
        next(err);
    }
}


exports.getAll = async (req,res,next) => {
    try{
        const allFeatures = await prisma.featureModule.findMany();

        res.status(200).json({
            status: "success",
            count: allFeatures.length,
            data: allFeatures
        });
    } catch(err) {
        next(err);
    }
}


exports.updateById = async (req,res,next) => {
    try {
        const data = featureSchema.parse(req.body);

        const updateFeature = await prisma.featureModule.update({
            where: {
                id: req.params.id
            },
            data: { 
                moduleName: data.moduleName,
                tag: slugify(data.moduleName, { replacement: '_', lower: true })
            }
        });

        res.status(201).json({
            message: "status",
            data: updateFeature
        })
    } catch(err) {
        next(err);
    }
}


exports.deleteById = async (req,res,next) => {
    try {
        const deleteFeature = await prisma.featureModule.delete({
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