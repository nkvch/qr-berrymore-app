import apiWrapper from '../../../apiWrapper/apiWrapper';
import paginated from '../../../controllers/paginated';
import addEmployee from '../../../controllers/employees/actions/addEmployee'

const employeesHandler = {
  get: paginated('employee'),
  post: addEmployee,
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiWrapper(employeesHandler);
