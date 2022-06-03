import path from 'path';
import getProduct from './getProduct';
import deleteFolder from '../../../apiWrapper/utils/deleteFolder';
import db from '../../../db/models';

const deleteProduct = async req => {
  const { id, photoPath } = await getProduct(req);

  if (photoPath) {
    const productPhotoFolderPath = path.join('public', photoPath
      .split('/')
      .slice(0, 4)
      .join('/')
    );

    deleteFolder(productPhotoFolderPath);
  }

  const response = await db.products.destroy({ where: { id: Number(id) } });

  return response;
};

export default deleteProduct;
