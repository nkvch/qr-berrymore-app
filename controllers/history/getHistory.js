import db, { sequelize } from '../../db/models';
import { Op } from 'sequelize';

const getHistory = async req => {
  const { fromDateTime, toDateTime, foreman, sorting, sortColumn, product, employee, page, qty, summarize } = req.query;

  const where = {};
  const empWhere = {};
  let order;
  let group;
  let attributes;
  let productAttrs;

  if (foreman) {
    empWhere.foremanId = foreman;
  }

  if (employee) {
    where.employeeId = Number(employee);
  }

  if (product) {
    where.productId = Number(product);
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

  if (summarize === 'true') {
    group = 'employeeId';
    attributes = [
      'employeeId',
      sequelize.col('employee.firstName'),
      sequelize.col('employee.lastName'),  
      [sequelize.fn('sum', sequelize.col('amount')), 'allAmount'],
      [sequelize.literal('sum(amount * product.productPrice)'), 'allPrice'],
      [sequelize.fn('max', sequelize.col('amount')), 'maxAmount'],
      [sequelize.fn('count', sequelize.col('*')), 'numPortions'],
    ]
    order = undefined;
    productAttrs = [];
  }

  const allResults = qty === '-1';

  const getParams = {
    ...(!allResults && {
      offset: Number((page - 1) * qty),
      limit: Number(qty),
    }),
    where,
    attributes,
    include: [{
      model: db.employees,
      as: 'employee',
      where: empWhere,
    }, {
      model: db.products,
      as: 'product',
      attributes: productAttrs,
    }],
    order,
    group,
  };

  const { count: total, rows } = await db.history.findAndCountAll(getParams);

  const pageData = rows.map(row => row.get({ plain: true }));

  return {
    pageData,
    total: summarize === 'true' ? total.length : total,
  };
};

export default getHistory;
