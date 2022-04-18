import prisma from '../../../prisma/prismaClient/prismaClient';

const getEmployee = async req => {
  const { id } = req.query;

  const data = await prisma.employee.findFirst({ where: { id: parseInt(id) } });

  return data;
};

export default getEmployee;
