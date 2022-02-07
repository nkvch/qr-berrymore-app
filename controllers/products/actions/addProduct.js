import prisma from '../../../prisma/prismaClient/prismaClient';
import path from 'path';
import GeneralError from '../../../apiWrapper/utils/errors/generalError';
import parseFormWithPhoto from '../../parseFormWithPhoto';
import checkOrCreateFolder from '../../../apiWrapper/utils/checkOrCreateFolder';
import moveFile from '../../../apiWrapper/utils/moveFile';

const addProduct = async req => {
  const { productName, productPrice, photo } = await parseFormWithPhoto(req);
  let photoPath;
  
  if (photo) {
    const savedFilesFolder = path.join('public', 'savedFiles', 'productsPhotos');
    const savedFilesFolderExists = await checkOrCreateFolder(savedFilesFolder);

    if (!savedFilesFolderExists) {
      throw new GeneralError('Проблема с загрузкой фотографии на сервер');
    }

    const productPhotoFolder = path.join(savedFilesFolder, productName);
    const productPhotoFolderCreated = await checkOrCreateFolder(productPhotoFolder);

    if (!productPhotoFolderCreated) {
      throw new GeneralError('Проблема с загрузкой фотографии на сервер');
    }

    const photoName  = photo.originalFilename.replace(/[/\\?%*:|"<>]/g, '-');
    const photo_save_path = path.join(productPhotoFolder, photoName);

    const movedFileToSaveDir = await moveFile(photo.filepath, photo_save_path);

    if (!movedFileToSaveDir) {
      throw new GeneralError('Проблема с сохранением фотографии');
    }

    photoPath = photo_save_path.replace('public', '');
  }
  
  const data = {
    productName,
    productPrice: Number(productPrice),
    photoPath,
  };

  const savedProduct = await prisma.product.create({ data });

  return savedProduct;
};

export default addProduct;
