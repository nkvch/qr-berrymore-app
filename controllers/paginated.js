import prisma from '../prisma/prismaClient/prismaClient';
import searchManyColumnsManyValues from '../apiWrapper/utils/searchManyColumnsManyValues';

const paginated = modelName => async req => {
  const { query: { page, qty, search, searchTextColumns, searchNumberColumns, selectColumns } } = req;

  let where = {};

  if (search) {
    where = searchManyColumnsManyValues(search, searchTextColumns, searchNumberColumns);
  }

  const allResults = qty === '-1';

  const select = selectColumns ? Object.fromEntries(selectColumns.split(',').map(column => ([column, true]))) : null;

  const getParams = {
    ...(!allResults && {
      skip: Number((page - 1) * qty),
      take: Number(qty),
    }),
    where,
    select,
  };

  const pageData = await prisma[modelName].findMany(getParams);

  const total = await prisma[modelName].count({ where });

  return {
    pageData,
    total,
  };
};

export default paginated;
