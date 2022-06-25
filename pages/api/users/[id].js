
import apiWrapper from '../../../apiWrapper/apiWrapper';
import deleteUser from '../../../controllers/users/actions/deleteUser';

const userHandler = {
  delete: deleteUser,
};

export default apiWrapper(userHandler);
