import prisma from '../../../prisma/prismaClient/prismaClient';

const addEmployee = async req => {
  const { body } = req;
  const data = typeof body === 'string' ? JSON.parse(body) : body;

  console.log(data);

  const savedEmployee = await prisma.employee.create({ data });

  return savedEmployee;
};

export default addEmployee;
