import prisma from '../../prisma/prismaClient/prismaClient';
import NotFound from '../../apiWrapper/utils/errors/notFound';
import Unauthorized from '../../apiWrapper/utils/errors/Unauthorized';
import generateJWT from '../../apiWrapper/utils/generateJWT';

const jwt = require('jsonwebtoken');

const refreshSession = async req => {
  const { authorization } = req.headers;

  if (!authorization) throw new Unauthorized('Authorization required!');

  const token = authorization.replace('Bearer ', '');

  let id;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    id = decoded.id;
  } catch (err) {
    throw new Unauthorized('Session expired!');
  }
  
  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      username: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!user) throw new NotFound('User does not exist', { username });

  const newToken = await generateJWT({ id });

  return { ...user, token: newToken };
};

export default refreshSession;