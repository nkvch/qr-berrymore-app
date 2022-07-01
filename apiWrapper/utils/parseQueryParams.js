const parseQueryParams = params => {
  if (!params) {
    return {};
  }

  const parsed = Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      let mappedVal = value;

      const isParamArray = typeof value === 'string' && value.includes(',');
      const isParamBoolean = ['true', 'false'].includes(value);

      if (isParamArray) {
        mappedVal = value.split(',');
      }

      if (isParamBoolean) {
        switch (value) {
          case 'true':
            mappedVal = true;
            break;
          case 'false':
            mappedVal = false;
          default:
            break;
        }
      }

      return [key, mappedVal];
    })
  );

  return parsed;
};

export default parseQueryParams;
