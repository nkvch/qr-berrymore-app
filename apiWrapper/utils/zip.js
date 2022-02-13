const zip = (keys, values) => {
  const result = {};

  for (let i in keys) {
    result[keys[i]] = values[i];
  }

  return result;
};

export default zip;
