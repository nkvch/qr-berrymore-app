const unpackObject = (obj, arrOfKeys) => {
  if (arrOfKeys.length === 1) {
    return obj[arrOfKeys[0]];
  } else {
    let result = {};

    arrOfKeys.forEach(key => {
      result[key] = obj[key];
    });

    return result;
  }
};

export default unpackObject;
