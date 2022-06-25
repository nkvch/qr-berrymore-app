import db from '../../db/models';

const getForeman = async req => {
  const { id } = req.query;

  const modelData = await db.users.findOne({
    where: { id: parseInt(id) },
    include: [{
      model: db.roles,
      as: 'role',
      where: {
        roleName: 'foreman',
      },
    }],
    attributes: ['firstName', 'lastName'],
  });

  const data = modelData.get({ plain: true });

  return data;
};

export default getForeman;
