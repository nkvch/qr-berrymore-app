import apiWrapper from '../../../apiWrapper/apiWrapper';
import bulkUpdate from '../../../controllers/employees/actions/bulkUpdate';

const employeesHandler = {
  put: bulkUpdate,
};

export default apiWrapper(employeesHandler);
