import prisma from '../../../prisma/prismaClient/prismaClient';
import generateJWT from './generateJWT';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authHandler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const { body } = req;
    const { username, password } = typeof body === 'string' ? JSON.parse(body) : body;

    const existUser = await prisma.user.findFirst({ where: { username } });

    if (!existUser) {
      return res.status(404).json({ msg: 'User does not exist' });
    }

    const { id, password: hashedPassword, ...userData } = existUser;

    const matches = await bcrypt.compare(password, hashedPassword);

    if (!matches) {
      return res.status(401).json({ msg: 'Incorrect password' });
    }

    const token = await generateJWT({ id });
    
    res.status(200).json({ ...userData, token });
  } else if (method === 'GET') {
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
  } else {
    res.status(405).json({ msg: 'Invalid method' });
  }
}

export default authHandler;
