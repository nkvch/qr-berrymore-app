import apiWrapper from '../../../apiWrapper/apiWrapper';
import updateFlag from '../../../controllers/flags/updateFlag';
import deleteFlag from '../../../controllers/flags/deleteFlag';
import getFlag from '../../../controllers/flags/getFlags';

const flagHandler = {
  put: updateFlag,
  delete: deleteFlag,
  get: getFlag,
};

export default apiWrapper(flagHandler);
