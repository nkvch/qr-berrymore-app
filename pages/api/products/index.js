import apiWrapper from '../../../apiWrapper/apiWrapper';
import paginated from '../../../controllers/paginated';
import addProduct from '../../../controllers/products/actions/addProduct'

const productsHandler = {
  get: paginated('product'),
  post: addProduct,
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiWrapper(productsHandler);
