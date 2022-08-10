import generateJWT from '../../apiWrapper/utils/generateJWT';
import NotFound from '../../apiWrapper/utils/errors/notFound';
import Unauthorized from '../../apiWrapper/utils/errors/Unauthorized';
import db from '../../db/models';

const bcrypt = require('bcryptjs');

const login = async req => {
  const { body } = req;
  const { username, password } = typeof body === 'string' ? JSON.parse(body) : body;
  const isDemo = process.env.IS_DEMO;

  const existUserModelData = await db.users.findOne({
    where: { username },
    include: [{
      model: db.roles,
      as: 'role',
    }],
  });

  const existUser = existUserModelData.get({ plain: true });

  if (!existUser) {
    throw new NotFound('User does not exist.', { username });
  }

  const { id, password: hashedPassword, ...userData } = existUser;

  const matches = isDemo ? hashedPassword === password : (await bcrypt.compare(password, hashedPassword));

  if (!matches) {
    throw new Unauthorized('Incorrect password!');
  }

  const token = await generateJWT({ id });
  
  return { ...userData, token, id };
};

export default login;