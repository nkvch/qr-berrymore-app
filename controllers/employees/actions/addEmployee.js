import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import GeneralError from '../../../apiWrapper/utils/errors/generalError';
import parseFormWithPhoto from '../../parseFormWithPhoto';
import checkOrCreateFolder from '../../../apiWrapper/utils/checkOrCreateFolder';
import moveFile from '../../../apiWrapper/utils/moveFile';
import db from '../../../db/models';

const addEmployee = async req => {
  const { firstName, lastName, photo, foremanId, address, pickUpAddress, phone, contract, ...flags } = await parseFormWithPhoto(req);
  let photoPath;

  if (photo) {
    const savedFilesFolder = path.join('public', 'savedFiles', 'employeesPhotos');
  
    const savedFilesFolderExists = await checkOrCreateFolder(savedFilesFolder);
  
    if (!savedFilesFolderExists) {
      throw new GeneralError('Problem has occured while trying to upload image');
    }

    const randomFolderName = uuidv4();

    const employeePhotoFolder = path.join(savedFilesFolder, randomFolderName);
  
    const employeePhotoFolderCreated = await checkOrCreateFolder(employeePhotoFolder);
  
    if (!employeePhotoFolderCreated) {
      throw new GeneralError('Problem has occured while trying to upload image');
    }
  
    const photoName  = photo.originalFilename.replace(/[/\\?%*:|"<>\s]/g, '-');
  
    const photo_save_path = path.join(employeePhotoFolder, photoName);
  
    const movedFileToSaveDir = await moveFile(photo.filepath, photo_save_path);
  
    if (!movedFileToSaveDir) {
      throw new GeneralError('Problem occured while saving the photo');
    }
  
    photoPath = photo_save_path.replace('public', '');
  }

  const berryId = uuidv4();

  const data = {
    firstName,
    lastName,
    photoPath,
    berryId,
    foremanId,
    contract,
    address,
    pickUpAddress,
    phone,
    ...flags,
  };

  const savedEmployee = await db.employees.create(data);

  return savedEmployee;
};

export default addEmployee;
