import apiWrapper from '../../wrappers/backend/apiWrapper';
import login from '../../endpoints/auth/login';
import refreshSession from '../../endpoints/auth/refreshSession';

const authHandler = {
  post: login,
  get: refreshSession,
};

export default apiWrapper(authHandler);
