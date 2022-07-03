import parseQueryParams from '../../../apiWrapper/utils/parseQueryParams';
import db from '../../../db/models';

const workTomorrow = async req => {
  const { ids, work } = req.body;

  const data = {
    workTomorrow: work,
  };

  await db.employees.update(data, {
    where: { id: ids },
  });

  const modelData = await db.employees.findAll({
    where: { id: ids },
  });

  const updatedEmployees = modelData.map(entry => entry.get({ plain: true }));

  return updatedEmployees;
};

export default workTomorrow;
