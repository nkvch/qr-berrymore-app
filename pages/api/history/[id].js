import apiWrapper from '../../../apiWrapper/apiWrapper';
import deleteHistory from '../../../controllers/history/deleteHistory';

const historyHandler = {
  delete: deleteHistory,
};

export default apiWrapper(historyHandler);
