const searchManyColumns = (searchValue, columnNames) => ({
  OR: columnNames.map(column => ({
    [column]: { contains: searchValue },
  })),
});

export default searchManyColumns;
