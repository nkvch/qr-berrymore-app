import db from '../../../db/models';

const bulkUpdate = async req => {
  const { ids, ...restParams } = req.body;

  const data = restParams;

  await db.employees.update(data, {
    where: { id: ids },
  });

  const modelData = await db.employees.findAll({
    where: { id: ids },
  });

  const updatedEmployees = modelData.map(entry => entry.get({ plain: true }));

  return updatedEmployees;
};

export default bulkUpdate;
