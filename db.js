const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    if (params.action === 'create') {
        params.args.data.password = await bcrypt.hash(params.args.data.password, 12);
        params.args.data.passwordConfirm = undefined;
    }
  }

  if(params.model === 'TaskType') {
    if (params.action == 'delete') {
        // Change action to an update
        params.action = 'update'
        params.args.data = { isActive: false }
      }
  }

  return next(params)
})

module.exports = prisma;