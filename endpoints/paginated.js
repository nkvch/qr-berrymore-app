import prisma from "../prisma/prismaClient/prismaClient";

const paginated = modelName => async req => {
  const { query: { page, qty } } = req;

  if (!page || !qty) {
    const data = await prisma[modelName].findMany();

    return data;
  } else {
    const getParams = {
      skip: Number((page - 1) * qty),
      take: Number(qty),
    };

    const pageData = await prisma[modelName].findMany(getParams);
    const total = await prisma[modelName].count();

    return {
      pageData,
      total,
    };
  }
};

export default paginated;
