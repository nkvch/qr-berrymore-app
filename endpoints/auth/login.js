import prisma from '../../prisma/prismaClient/prismaClient';
import generateJWT from '../../apiWrapper/utils/generateJWT';
import NotFound from '../../apiWrapper/utils/errors/notFound';
import Unauthorized from '../../apiWrapper/utils/errors/Unauthorized';

const bcrypt = require('bcryptjs');

const login = async req => {
  const { body } = req;
  const { username, password } = typeof body === 'string' ? JSON.parse(body) : body;

  const existUser = await prisma.user.findFirst({ where: { username } });

  if (!existUser) {
    throw new NotFound('User does not exist.', { username });
  }

  const { id, password: hashedPassword, ...userData } = existUser;

  const matches = await bcrypt.compare(password, hashedPassword);

  if (!matches) {
    throw new Unauthorized('Incorrect password!');
  }

  const token = await generateJWT({ id });
  
  return { ...userData, token };
};

export default login;