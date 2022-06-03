import db from '../../../db/models';

const bcrypt = require('bcryptjs');

const addUser = async req => {
  const { body } = req;
  const user = typeof body === 'string' ? JSON.parse(body) : body;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  const data = { ...user, password: hash };

  const modelCreateData = await db.users.create(data);

  const { id, password, ...savedUser } = modelCreateData.get({ plain: true });

  return savedUser;
};

export default addUser;