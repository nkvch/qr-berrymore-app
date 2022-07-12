import db from "../../db/models";

const deleteFlag = async req => {
  const { id } = req.query;

  const response = await db.flags.destroy({ where: { id: Number(id) } });

  return response;
};

export default deleteFlag;
