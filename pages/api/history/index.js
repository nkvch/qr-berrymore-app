import apiWrapper from '../../../apiWrapper/apiWrapper';
import addToHistory from '../../../controllers/history/addToHistory';

const historyHandler = {
  post: addToHistory,
};

export default apiWrapper(historyHandler);
