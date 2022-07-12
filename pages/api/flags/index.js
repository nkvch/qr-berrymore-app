import apiWrapper from '../../../apiWrapper/apiWrapper';
import addFlag from '../../../controllers/flags/addFlag';
import paginated from '../../../controllers/paginated';

const flagsHandler = {
  get: paginated('flags'),
  post: addFlag,
};

export default apiWrapper(flagsHandler);
