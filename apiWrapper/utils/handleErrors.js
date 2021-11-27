import BadRequest from './errors/badRequest';
import GeneralError from './errors/generalError';
import UniqueConstraintError from './errors/uniqueConstraintError';
import NotFound from './errors/notFound';
import EntityInUseError from './errors/entityInUseError';
import Unauthorized from './errors/Unauthorized';

const getResponseCode = err => {
  switch (err.constructor) {
    case BadRequest:
      return 400;
    case NotFound:
      return 404;
    case EntityInUseError:
      return 400;
    case UniqueConstraintError:
      return 400;
    case Unauthorized:
      return 401;
    default:
      return 500;
  }
};

const handleErrors = (err, res) => {
  const responseBody = {
    status: 'error',
    message: err.message,
    data: err.data,
  };

  const responseCode = getResponseCode(err);

  console.error(err);
  return res.status(responseCode).json(responseBody);
};

export { handleErrors };