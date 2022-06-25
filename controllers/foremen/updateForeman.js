import GeneralError from '../../apiWrapper/utils/errors/generalError';
import db from '../../db/models';

const updateForeman = async req => {
  const { id } = req.query;
  const { firstName, lastName } = req.body;

  const foremanModelData = await db.users.findOne({
    where: { id },
    include: [{
      model: db.roles,
      as: 'role',
      where: { roleName: 'foreman' },
    }],
  });

  if (!foremanModelData) {
    throw new GeneralError('No foreman with such id');
  }

  await db.users.update({
    firstName, lastName
  }, { where: { id } });

  const updatedForemanModelData = await db.users.findOne({
    where: { id },
    attributes: ['firstName', 'lastName'],
  });

  const updatedForeman = updatedForemanModelData.get({ plain: true });

  return updatedForeman;
};

export default updateForeman;
