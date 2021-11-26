import prisma from '../../prisma/prismaClient/prismaClient';
import generateJWT from '../../utils/generateJWT';

const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { body } = req;
  const { username, password } = typeof body === 'string' ? JSON.parse(body) : body;

  const existUser = await prisma.user.findFirst({ where: { username } });

  if (!existUser) {
    // error todo
    return res.status(404).json({ msg: 'User does not exist' });
  }

  const { id, password: hashedPassword, ...userData } = existUser;

  const matches = await bcrypt.compare(password, hashedPassword);

  if (!matches) {
    // error todo
    return res.status(401).json({ msg: 'Incorrect password' });
  }

  const token = await generateJWT({ id });
  
  res.status(200).json({ ...userData, token });
};

export default login;