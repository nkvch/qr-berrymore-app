import getNumbersLike from './getNumbersLike';

const searchManyColumns = (searchValue, columns) => ({
  OR: columns.map(({ columnName, type }) => ({
    [columnName]: type === 'number'
      ? { in: getNumbersLike(searchValue, 1000) }
      : { contains: searchValue },
  })),
});

export default searchManyColumns;
