const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    if (params.action === 'create') {
        params.args.data.passwordConfirm = undefined;
    }
  }
  
  return next(params)
})

module.exports = prisma;