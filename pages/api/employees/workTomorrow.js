import apiWrapper from '../../../apiWrapper/apiWrapper';
import workTomorrow from '../../../controllers/employees/actions/workTomorrow';

const employeesHandler = {
  put: workTomorrow,
};

export default apiWrapper(employeesHandler);
