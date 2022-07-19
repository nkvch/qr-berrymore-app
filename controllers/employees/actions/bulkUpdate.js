import db from '../../../db/models';

const bulkUpdate = async req => {
  const { ids, ...restParams } = req.body;

  const data = restParams;

  const where = ids ? { id: ids } : {};

  await db.employees.update(data, {
    where,
  });

  const modelData = await db.employees.findAll({
    where,
  });

  const updatedEmployees = modelData.map(entry => entry.get({ plain: true }));

  return updatedEmployees;
};

export default bulkUpdate;
