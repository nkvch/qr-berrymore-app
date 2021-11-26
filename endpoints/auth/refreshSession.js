import prisma from '../../prisma/prismaClient/prismaClient';
import generateJWT from '../../utils/generateJWT';

const jwt = require('jsonwebtoken');

const refreshSession = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ msg: 'Unauthorized' });

  const token = authorization.replace('Bearer ', '');

  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      username: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!user) return res.status(404).json({status: 'not found'});

  const newToken = await generateJWT({ id });

  res.status(200).json({ ...user, token: newToken });
};

export default refreshSession;