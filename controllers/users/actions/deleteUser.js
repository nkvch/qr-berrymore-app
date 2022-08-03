import GeneralError from '../../../apiWrapper/utils/errors/generalError';
import db from '../../../db/models';

const deleteUser = async req => {
  const { id } = req.query;

  const userModelData = await db.users.findOne({
    where: { id: Number(id) },
    include: [{
      model: db.roles,
      as: 'role',
    }],
  });

  const user = userModelData.get({ plain: true });

  if (user?.role?.roleName === 'admin') {
    throw new GeneralError('You can\'t delete admin account');
  }

  const response = await db.users.destroy({ where: { id: Number(id) } });

  return response;
};

export default deleteUser;
