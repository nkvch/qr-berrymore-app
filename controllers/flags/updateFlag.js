import db from "../../db/models";

const updateFlag = async req => {
  const { id } = req.query;
  const { name, color } = req.body;

  const data = {
    name, color
  };

  await db.flags.update(data, {
    where: { id: Number(id) },
  });

  const modelData = await db.flags.findOne({
    where: { id: Number(id) },
  });

  const updatedFlag = modelData.get({ plain: true });

  return updatedFlag;
};

export default updateFlag;
