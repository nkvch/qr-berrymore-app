import prisma from '../../../prisma/prismaClient/prismaClient';

const getEmployeeByBerryId = async req => {
  const { berryId } = req.query;

  const data = await prisma.employee.findFirst({ where: { berryId } });

  return data;
};

export default getEmployeeByBerryId;
