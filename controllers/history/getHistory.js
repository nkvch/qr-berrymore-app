import prisma from '../../prisma/prismaClient/prismaClient';

const getHistory = async req => {
  const { fromDateTime, toDateTime, sorting, sortColumn, product, employee, page, qty } = req.query;

  const where = {};
  let orderBy = undefined;

  if (employee) {
    where.employeeId = Number(employee) || undefined;
  }

  if (product) {
    where.productId = Number(product) || undefined;
  }

  if (fromDateTime || toDateTime) {
    where.dateTime = {
      ...(fromDateTime && {
        gte: fromDateTime,
      }),
      ...(toDateTime && {
        lte: toDateTime,
      }),
    };
  }

  if (sorting && sortColumn) {
    orderBy = [{
      [sortColumn]: sorting,
    }];
  }

  const allResults = qty === '-1';

  const getParams = {
    ...(!allResults && {
      skip: Number((page - 1) * qty),
      take: Number(qty),
    }),
    where,
    include: {
      employee: true,
      product: true,
    },
    orderBy,
  };

  const pageData = await prisma.history.findMany(getParams);

  const total = await prisma.history.count({ where });

  return {
    pageData,
    total,
  };
};

export default getHistory;
