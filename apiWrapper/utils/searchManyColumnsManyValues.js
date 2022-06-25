import { combinations, combineTwoArrays } from '../utils/combinations';
import zip from '../utils/zip';
import { Op } from 'sequelize';

const searchManyColumnsManyValues = (search, searchColumns) => {
  const searchValues = search.split(' ');
  const searchColumnNames = searchColumns ? searchColumns.split(',') : [];

  const columnsValuesCombinations = combinations(searchColumnNames, searchValues.length)
    .map(columnNames => zip(columnNames, searchValues.map(value => ({ [Op.like]: `%${value}%` }))));
  
  return {
    [Op.or]: columnsValuesCombinations,
  };
};

export default searchManyColumnsManyValues;
