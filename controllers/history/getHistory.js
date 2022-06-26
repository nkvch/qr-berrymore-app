import db from '../../db/models';
import { Op } from 'sequelize';

const getHistory = async req => {
  const { fromDateTime, toDateTime, foreman, sorting, sortColumn, product, employee, page, qty } = req.query;

  const where = {};
  const empWhere = {};
  let order = undefined;

  if (foreman) {
    empWhere.foremanId = foreman;
  }

  if (employee) {
    where.employeeId = Number(employee) || undefined;
  }

  if (product) {
    where.productId = Number(product) || undefined;
  }

  if (fromDateTime || toDateTime) {
    where.dateTime = {
      ...(fromDateTime && {
        [Op.gte]: fromDateTime,
      }),
      ...(toDateTime && {
        [Op.lte]: toDateTime,
      }),
    };
  }

  if (sorting && sortColumn) {
    order = [[sortColumn, sorting]];
  }

  const allResults = qty === '-1';

  const getParams = {
    ...(!allResults && {
      offset: Number((page - 1) * qty),
      limit: Number(qty),
    }),
    where,
    include: [{
      model: db.employees,
      as: 'employee',
      where: empWhere,
    }, {
      model: db.products,
      as: 'product',
    }],
    order,
  };

  const { count: total, rows } = await db.history.findAndCountAll(getParams);

  const pageData = rows.map(row => row.get({ plain: true }));

  return {
    pageData,
    total,
  };
};

export default getHistory;
