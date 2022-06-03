import searchManyColumnsManyValues from '../apiWrapper/utils/searchManyColumnsManyValues';
import db from '../db/models';

const paginated = modelName => async req => {
  const { query: { page, qty, search, searchTextColumns, searchNumberColumns, selectColumns } } = req;

  let where = {};

  if (search) {
    where = searchManyColumnsManyValues(search, searchTextColumns, searchNumberColumns);
  }

  const allResults = qty === '-1';

  const attributes = selectColumns?.split(',');

  const getParams = {
    ...(!allResults && {
      offset: Number((page - 1) * qty),
      limit: Number(qty),
    }),
    where,
    attributes,
  };

  const { count: total, rows } = await db[modelName].findAndCountAll(getParams);

  const pageData = rows.map(row => row.get({ plain: true }));

  return {
    pageData,
    total,
  };
};

export default paginated;
