import { combinations, combineTwoArrays } from '../utils/combinations';
import zip from '../utils/zip';
import getNumbersLike from './getNumbersLike';
import db from '../../db/models';
import { Op } from 'sequelize';

const searchManyColumnsManyValues = (search, searchTextColumns, searchNumberColumns) => {
  const searchValues = search.split(' ');
  const searchTextColumnNames = searchTextColumns?.split(',') || [];
  const searchNumberColumnNames = searchNumberColumns?.split(',') || [];
  const searchTextValues = [];
  const searchNumberValues = [];

  searchValues.forEach(value => {
    if (!isNaN(value)) {
      searchNumberValues.push(value);
    } else {
      searchTextValues.push(value);
    }
  });

  const textColumnsCombinations = combinations(searchTextColumnNames, searchTextValues.length)
    .map(columnNames => zip(columnNames, searchTextValues.map(value => ({ [Op.like]: `%${value}%` }))));
  const numberColumnsCombinations = combinations(searchNumberColumnNames, searchNumberValues.length)
    .map(columnNames => zip(columnNames, searchNumberValues.map(value => ({ [Op.in]: getNumbersLike(value, 1000) }))));

  let allSearchCombinations;

  if (textColumnsCombinations.length && !numberColumnsCombinations.length) {
    allSearchCombinations = textColumnsCombinations;
  } else if (!textColumnsCombinations.length && numberColumnsCombinations.length) {
    allSearchCombinations = numberColumnsCombinations;
  } else {
    allSearchCombinations = combineTwoArrays(textColumnsCombinations, numberColumnsCombinations)
      .map(([textColComb, numColComb]) => ({ ...textColComb, ...numColComb }));
  }
  
  return {
    [Op.or]: allSearchCombinations,
  };
};

export default searchManyColumnsManyValues;
