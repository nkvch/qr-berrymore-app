import apiWrapper from '../../apiWrapper/apiWrapper';
import login from '../../controllers/auth/login';
import refreshSession from '../../controllers/auth/refreshSession';

const authHandler = {
  post: login,
  get: refreshSession,
};

export default apiWrapper(authHandler);
