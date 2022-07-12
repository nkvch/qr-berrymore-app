import db from "../../db/models";

const addFlag = async req => {
  const { name, color } = req.body;

  const data = {
    name,
    color,
  };

  const modelData = await db.flags.create(data);

  const savedData = modelData.get({ plain: true });

  return savedData;
};

export default addFlag;
