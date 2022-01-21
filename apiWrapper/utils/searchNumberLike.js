import prisma from '../../prisma/prismaClient/prismaClient';
import { raw } from '@prisma/client';

const searchNumberLike = async (modelName, search, qty, page, columnNames) => {
  const whereClause = columnNames
    .map(column => `${column} LIKE '%${search}%'`)
    .join(' AND ');

  let dataQuery = `SELECT * FROM ${modelName}s WHERE ${whereClause}`;

  if (qty !== '-1') {
    dataQuery += ` LIMIT ${Number(qty)} OFFSET ${Number((page - 1) * qty)}`;
  }

  const countQuery = `SELECT count(*) total FROM ${modelName}s WHERE ${whereClause}`;

  const pageData = await prisma.$queryRaw`${raw(dataQuery)}`;

  const [{ total }] = await prisma.$queryRaw`${raw(countQuery)}`;

  return {
    pageData,
    total,
  };
};

export default searchNumberLike;
