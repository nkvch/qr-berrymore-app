import db from '../../db/models';

const deleteHistory = async req => {
  const { id } = req.query;

  const response = await db.history.destroy({ where: { id: Number(id) } });

  return response;
};

export default deleteHistory;
