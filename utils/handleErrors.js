const getResponseCode = err => {
  // switch (err.constructor) {
  //   case BadRequest:
  //     return 400;
  //   case NotFound:
  //     return 404;
  //   case EntityInUseError:
  //     return 400;
  //   default:
  //     return 500;
  // }
  return 500;
};

const handleErrors = (err, res) => {
  const response = {
    status: err.status,
    message: err.message,
    data: err.data,
  };

  const responseCode = getResponseCode(err);

  return res.status(responseCode).json(response);
};

export { handleErrors };