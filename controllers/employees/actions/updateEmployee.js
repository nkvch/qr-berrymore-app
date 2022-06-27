import path from 'path';
import GeneralError from '../../../apiWrapper/utils/errors/generalError';
import parseFormWithPhoto from '../../parseFormWithPhoto';
import checkOrCreateFolder from '../../../apiWrapper/utils/checkOrCreateFolder';
import moveFile from '../../../apiWrapper/utils/moveFile';
import db from '../../../db/models';
import fs from 'fs';

const updateEmployee = async req => {
  const { firstName, lastName, photo, foremanId, address, phone, contract } = await parseFormWithPhoto(req);
  const { id } = req.query;

  let photoPath;

  if (photo) {
    const savedFilesFolder = path.join('public', 'savedFiles', 'employeesPhotos');

    const savedFilesFolderExists = await checkOrCreateFolder(savedFilesFolder);

    if (!savedFilesFolderExists) {
      throw new GeneralError('Проблема с загрузкой фотографии на сервер');
    }

    const employeePhotoFolder = path.join(savedFilesFolder, encodeURIComponent(`${firstName}_${lastName}`));

    const employeePhotoFolderCreated = await checkOrCreateFolder(employeePhotoFolder);

    if (!employeePhotoFolderCreated) {
      throw new GeneralError('Проблема с загрузкой фотографии на сервер');
    }

    const photoName  = photo.originalFilename.replace(/[/\\?%*:|"<>\s]/g, '-');

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
    foremanId: foremanId || null,
    contract,
    address,
    phone,
  };

  await db.employees.update(data, {
    where: { id: Number(id) },
  });

  const modelData = await db.employees.findOne({
    where: { id: Number(id) },
  });

  const updatedEmployee = modelData.get({ plain: true });

  return updatedEmployee;
};

export default updateEmployee;
