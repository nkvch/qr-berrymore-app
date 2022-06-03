import generateJWT from '../../apiWrapper/utils/generateJWT';
import NotFound from '../../apiWrapper/utils/errors/notFound';
import Unauthorized from '../../apiWrapper/utils/errors/Unauthorized';
import db from '../../db/models';

const bcrypt = require('bcryptjs');

const login = async req => {
  const { body } = req;
  const { username, password } = typeof body === 'string' ? JSON.parse(body) : body;

  const existUser = await db.users.findOne({ where: { username }, raw: true });

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