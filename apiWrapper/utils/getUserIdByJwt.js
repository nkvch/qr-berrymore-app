import NotFound from '../../apiWrapper/utils/errors/notFound';
import Unauthorized from '../../apiWrapper/utils/errors/Unauthorized';
import jwt from 'jsonwebtoken';

const getUserIdByJwt = async req => {
  const { authorization } = req.headers;

  if (!authorization) throw new Unauthorized('Authorization required!');

  const token = authorization.replace('Bearer ', '');

  let id;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    id = decoded.id;
  } catch (err) {
    throw new Unauthorized('Session expired!');
  }

  return id;
};

export default getUserIdByJwt;
