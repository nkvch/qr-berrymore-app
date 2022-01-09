import apiWrapper from '../../../apiWrapper/apiWrapper';
import paginated from '../../../endpoints/paginated';
import addEmployee from '../../../endpoints/employees/actions/addEmployee'

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
