const response = (data, res) => {
  const status = 'ok';

  const responseBody = {
    status,
    data,
  };

  res.status(200).json(responseBody);
};

export default response;
