import apiWrapper from '../../../apiWrapper/apiWrapper';
import getProduct from '../../../controllers/products/actions/getProduct';
import updateProduct from '../../../controllers/products/actions/updateProduct';
import deleteProduct from '../../../controllers/products/actions/deleteProduct';

const productHandler = {
  get: getProduct,
  put: updateProduct,
  delete: deleteProduct,
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiWrapper(productHandler);
