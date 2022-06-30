const parseQueryParams = params => {
  if (!params) {
    return {};
  }

  const parsed = Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      let mappedVal = value;

      const isParamArray = typeof value === 'string' && value.includes(',');

      if (isParamArray) {
        mappedVal = value.split(',');
      }

      return [key, mappedVal];
    })
  );

  return parsed;
};

export default parseQueryParams;
