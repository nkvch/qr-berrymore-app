import prisma from '../../../prisma/prismaClient/prismaClient';
import path from 'path';
import getProduct from './getProduct';
import deleteFolder from '../../../apiWrapper/utils/deleteFolder';

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

  const response = await prisma.product.delete({ where: { id: Number(id) } });

  return response;
};

export default deleteProduct;
