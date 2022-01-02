const searchManyColumns = (searchValue, columnNames) => ({
  OR: columnNames.map(column => ({
    [column]: column === 'id'
      ? { in: [Number(searchValue)].filter(Boolean) }
      : { contains: searchValue },
  })),
});

export default searchManyColumns;
