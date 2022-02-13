const hasDuplicates = arr => {
  let result = false;

  for (let i = 0; i < arr.length; i++) {
    if (arr.slice(i + 1).includes(arr[i])) {
      result = true;
      break;
    }
  }

  return result;
};

const combinations = (arr, len) => {
  if (!len) {
    return [];
  } else if (len === 1) {
    return arr.map(value => ([value]));
  } else {
    return [...Array(len).keys()]
      .reduce(
        acc =>
          arr.concat(acc.flatMap(value => arr.map(otherValue => ([value, otherValue])))),
        []
      )
      .filter(comb => Array.isArray(comb) && comb.length === len && !hasDuplicates(comb));
  }
};

const combineTwoArrays = (first, second) => {
  const result = [];

  for (let elOfFirst of first) {
    for (let elOfSecond of second) {
      result.push([elOfFirst, elOfSecond]);
    }
  }

  return result;
};

export { combinations, combineTwoArrays };
