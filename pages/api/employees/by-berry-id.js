import getEmployeeByBerryId from '../../../controllers/employees/actions/getEmployeeByBerryId';
import apiWrapper from '../../../apiWrapper/apiWrapper';

const employeeByBerryIdHandler = {
  get: getEmployeeByBerryId,
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiWrapper(employeeByBerryIdHandler);
