import apiWrapper from '../../../apiWrapper/apiWrapper';
import getEmployee from '../../../controllers/employees/actions/getEmployee';
import updateEmployee from '../../../controllers/employees/actions/updateEmployee';

const employeeHandler = {
  get: getEmployee,
  put: updateEmployee,
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiWrapper(employeeHandler);
