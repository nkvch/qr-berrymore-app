import prisma from '../prisma/prismaClient/prismaClient';
import searchManyColumns from '../apiWrapper/utils/searchManyColumns';


const paginated = modelName => async req => {
  const { query: { page, qty, search, searchTextColumns, searchNumberColumns, selectColumns } } = req;

  let where = {};

  const textColumns = searchTextColumns.split(',').map(columnName => ({
    columnName,
    type: 'text',
  }));

  const numberColumns = searchNumberColumns.split(',').map(columnName => ({
    columnName,
    type: 'number',
  }));

  if (search) {
    const searchColumns = [...textColumns];

    const searchForNumbers = !Number.isNaN(search);

    if (searchForNumbers) {
      searchColumns.push(...numberColumns);
    }

    where = searchManyColumns(search, searchColumns);
  }

  const allResults = qty === '-1';

  const select = Object.fromEntries(selectColumns.split(',').map(column => ([column, true])));

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
