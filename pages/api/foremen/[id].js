import apiWrapper from '../../../apiWrapper/apiWrapper';
import getForeman from '../../../controllers/foremen/getForeman';
import updateForeman from '../../../controllers/foremen/updateForeman';

const foremanHandler = {
  get: getForeman,
  put: updateForeman,
};

export default apiWrapper(foremanHandler);
