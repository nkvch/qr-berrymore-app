import apiWrapper from '../../../apiWrapper/apiWrapper';
import addUser from '../../../controllers/users/actions/addUser';

const usersHandler = {
  post: addUser,
};

export default apiWrapper(usersHandler);
