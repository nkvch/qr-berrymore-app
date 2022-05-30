import apiWrapper from '../../../apiWrapper/apiWrapper';
import addToHistory from '../../../controllers/history/addToHistory';
import getHistory from '../../../controllers/history/getHistory';

const historyHandler = {
  post: addToHistory,
  get: getHistory,
};

export default apiWrapper(historyHandler);
