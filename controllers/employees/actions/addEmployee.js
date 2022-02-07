import prisma from '../../../prisma/prismaClient/prismaClient';
import path from 'path';
import GeneralError from '../../../apiWrapper/utils/errors/generalError';
import parseFormWithPhoto from '../../parseFormWithPhoto';
import checkOrCreateFolder from '../../../apiWrapper/utils/checkOrCreateFolder';
import moveFile from '../../../apiWrapper/utils/moveFile';

const addEmployee = async req => {
  const { firstName, lastName, photo } = await parseFormWithPhoto(req);
  let photoPath;

  if (photo) {
    const savedFilesFolder = path.join('public', 'savedFiles', 'employeesPhotos');
  
    const savedFilesFolderExists = await checkOrCreateFolder(savedFilesFolder);
  
    if (!savedFilesFolderExists) {
      throw new GeneralError('Проблема с загрузкой фотографии на сервер');
    }
  
    const employeePhotoFolder = path.join(savedFilesFolder, `${firstName}_${lastName}`);
  
    const employeePhotoFolderCreated = await checkOrCreateFolder(employeePhotoFolder);
  
    if (!employeePhotoFolderCreated) {
      throw new GeneralError('Проблема с загрузкой фотографии на сервер');
    }
  
    const photoName  = photo.originalFilename.replace(/[/\\?%*:|"<>]/g, '-');
  
    const photo_save_path = path.join(employeePhotoFolder, photoName);
  
    const movedFileToSaveDir = await moveFile(photo.filepath, photo_save_path);
  
    if (!movedFileToSaveDir) {
      throw new GeneralError('Проблема с сохранением фотографии');
    }
  
    photoPath = photo_save_path.replace('public', '');
  }

  const data = {
    firstName,
    lastName,
    photoPath,
  };

  const savedEmployee = await prisma.employee.create({ data });

  return savedEmployee;
};

export default addEmployee;
