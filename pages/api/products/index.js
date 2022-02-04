import apiWrapper from '../../../apiWrapper/apiWrapper';
import paginated from '../../../endpoints/paginated';
import addProduct from '../../../endpoints/products/actions/addProduct'

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
