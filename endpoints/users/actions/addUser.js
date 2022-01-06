import prisma from '../../../prisma/prismaClient/prismaClient';

const bcrypt = require('bcryptjs');

const addUser = async req => {
  const { body } = req;
  const user = typeof body === 'string' ? JSON.parse(body) : body;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  const data = { ...user, password: hash };

  const { id, password, ...savedUser } = await prisma.user.create({ data });

  return savedUser;
};

export default addUser;