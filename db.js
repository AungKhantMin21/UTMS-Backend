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

  return next(params)
})

module.exports = prisma;