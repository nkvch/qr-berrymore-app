import prisma from '../../../prisma/prismaClient/prismaClient';

const getProduct = async req => {
  const { id } = req.query;

  const data = await prisma.product.findFirst({ where: { id: parseInt(id) } });

  return data;
};

export default getProduct;
