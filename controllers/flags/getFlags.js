import db from "../../db/models";

const getFlag = async req => {
  const modelData = await db.flags.findOne({
    where: {
      id: Number(req.query.id),
    },
  });


  const flag = modelData.get({ plain: true });

  return flag;
};

export default getFlag;
