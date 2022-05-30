import prisma from '../../prisma/prismaClient/prismaClient';

const addToHistory = async req => {
  const { employeeId, productId, amount, dateTime } = req.body;

  console.log(dateTime, typeof dateTime);

  const data = {
    employeeId,
    productId,
    amount,
    dateTime: new Date(dateTime),
  };

  const savedData = await prisma.history.create({ data });

  return savedData;
};

export default addToHistory;
