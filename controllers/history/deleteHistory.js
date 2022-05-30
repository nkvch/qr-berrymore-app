import prisma from '../../prisma/prismaClient/prismaClient';

const deleteHistory = async req => {
  const { id } = req.query;

  const response = await prisma.history.delete({ where: { id: Number(id) } });

  return response;
};

export default deleteHistory;
