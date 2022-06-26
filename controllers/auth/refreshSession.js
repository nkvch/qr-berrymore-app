import NotFound from '../../apiWrapper/utils/errors/notFound';
import Unauthorized from '../../apiWrapper/utils/errors/Unauthorized';
import generateJWT from '../../apiWrapper/utils/generateJWT';
import getUserIdByJwt from '../../apiWrapper/utils/getUserIdByJwt';
import db from '../../db/models';

const jwt = require('jsonwebtoken');

const refreshSession = async req => {
  const id = await getUserIdByJwt(req);

  const userModelData = await db.users.findOne({
    where: { id },
    include: [{
      model: db.roles,
      as: 'role',
    }],
  });

  const { password, ...user} = userModelData.get({ plain: true });

  if (!user) throw new NotFound('User does not exist', { username });

  const newToken = await generateJWT({ id });

  return { ...user, token: newToken, id };
};

export default refreshSession;