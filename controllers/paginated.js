import searchManyColumnsManyValues from '../apiWrapper/utils/searchManyColumnsManyValues';
import db from '../db/models';
import { Op } from 'sequelize';
import util from 'util';
import parseQueryParams from '../apiWrapper/utils/parseQueryParams';

const paginated = (modelName, requiredParams, order) => async req => {
  const { query: { page, qty, search, searchColumns, selectColumns, ...strRestParams } } = req;

  const restParams = parseQueryParams(strRestParams);
  
  let where = { [Op.and]: [] };

  if (restParams) {
    where[Op.and].push(parseQueryParams(restParams));
  }

  const include = [];

  if (search) {
    where[Op.and].push(searchManyColumnsManyValues(search, searchColumns));
  }

  if (requiredParams) {
    const { foreignParams, ...ownParams } = requiredParams;

    where[Op.and].push(ownParams);

    if (foreignParams) {
      Object.entries(foreignParams).forEach(([_modelName, params]) => {
        const { as, where, attributes, required } = params;

        include.push({
          model: db[_modelName],
          as,
          where,
          required,
          attributes,
        });
      });
    }
  }

  const allResults = qty === '-1';

  const attributes = selectColumns?.split(',');

  const getParams = {
    ...(!allResults && {
      offset: Number((page - 1) * qty),
      limit: Number(qty),
    }),
    where,
    include,
    attributes,
    order,
  };

  const { count: total, rows } = await db[modelName].findAndCountAll(getParams);

  const pageData = rows.map(row => row.get({ plain: true }));

  return {
    pageData,
    total,
  };
};

export default paginated;
