import db from "../../../db/models";

const getEmployee = async req => {
  const { id } = req.query;

  const modelData = await db.employees.findOne({ where: { id: parseInt(id) } });

  const data = modelData.get({ plain: true });

  return data;
};

export default getEmployee;
