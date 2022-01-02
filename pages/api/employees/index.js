import apiWrapper from '../../../apiWrapper/apiWrapper';
import paginated from '../../../endpoints/paginated';
import addEmployee from '../../../endpoints/employees/actions/addEmployee';

const employeesHandler = {
  get: paginated('employee'),
  post: addEmployee,
};

export default apiWrapper(employeesHandler);
