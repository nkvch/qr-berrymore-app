import apiWrapper from '../../../apiWrapper/apiWrapper';
import paginated from '../../../endpoints/paginated';

const employeesHandler = {
  get: paginated('employee'),
};

export default apiWrapper(employeesHandler);
