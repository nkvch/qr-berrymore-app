const getLocalDateTimeString = dateTime => {
  const offset = dateTime.getTimezoneOffset() * 60 * 1000;
  const localDateTime = new Date(dateTime - offset);

  return localDateTime.toISOString().slice(0, -8);
};

export default getLocalDateTimeString;
