import prisma from "../prisma/prismaClient/prismaClient";
import searchManyColumns from '../apiWrapper/utils/searchManyColumns';

const paginated = modelName => async req => {
  const { query: { page, qty, search, searchColumns } } = req;

  if (!page || !qty) {
    const data = await prisma[modelName].findMany();

    return data;
  } else {
    let where = {};

    if (search) {
      const columnNames = searchColumns.split(',');

      where = searchManyColumns(search, columnNames);
    }

    const allResults = qty === '-1';

    const getParams = {
      ...(!allResults && {
        skip: Number((page - 1) * qty),
        take: Number(qty),
      }),
      where,
    };

    const pageData = await prisma[modelName].findMany(getParams);

    const total = await prisma[modelName].count({ where });

    return {
      pageData,
      total,
    };
  }
};

export default paginated;
