import db from "../../../db/models";

const getEmployeeByBerryId = async req => {
  const { berryId } = req.query;

  const modelData = await db.employees.findOne({ where: { berryId } });

  const data = modelData.get({ plain: true });

  return data;
};

export default getEmployeeByBerryId;
