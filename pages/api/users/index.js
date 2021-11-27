import apiWrapper from '../../../apiWrapper/apiWrapper';
import addUser from '../../../endpoints/users/actions/addUser';

const usersHandler = {
  post: addUser,
};

export default apiWrapper(usersHandler);
