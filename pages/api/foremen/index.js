import apiWrapper from '../../../apiWrapper/apiWrapper';
import paginated from '../../../controllers/paginated';

const foremenHandler = {
  get: paginated('users', { foreignParams: {
    roles: { as: 'role', where: { roleName: 'foreman' } },
  } }),
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiWrapper(foremenHandler);
