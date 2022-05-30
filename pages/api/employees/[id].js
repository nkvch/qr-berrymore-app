import apiWrapper from '../../../apiWrapper/apiWrapper';
import getEmployee from '../../../controllers/employees/actions/getEmployee';
import updateEmployee from '../../../controllers/employees/actions/updateEmployee';
import deleteEmployee from '../../../controllers/employees/actions/deleteEmployee';

const employeeHandler = {
  get: getEmployee,
  put: updateEmployee,
  delete: deleteEmployee,
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiWrapper(employeeHandler);
