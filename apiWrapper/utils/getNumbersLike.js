const getNumbersLike = (num, limit) => {
  const numbers = [];

  for (let i = 0; i < limit; i++) {
    if (String(i).includes(num)) {
      numbers.push(i);
    }
  }

  return numbers;
};

export default getNumbersLike;
