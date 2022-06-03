import db from '../../db/models';

const addToHistory = async req => {
  const { employeeId, productId, amount, dateTime } = req.body;

  const data = {
    employeeId,
    productId,
    amount,
    dateTime: new Date(dateTime),
  };

  const modelData = await db.history.create(data);

  const savedData = modelData.get({ plain: true });

  return savedData;
};

export default addToHistory;
