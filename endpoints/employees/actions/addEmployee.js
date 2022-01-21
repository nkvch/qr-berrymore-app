import prisma from '../../../prisma/prismaClient/prismaClient';
import { IncomingForm } from 'formidable';
import path from 'path';
import fs from 'fs';
import GeneralError from '../../../apiWrapper/utils/errors/generalError';

const checkFolderExistsOrCreate = async pathname => {
  try {
    await new Promise((res, rej) => {
      fs.stat(pathname, err => err ? rej(err) : res('vse zbs'));
    });
  } catch (err) {
    if (err?.code === 'ENOENT') {
      try {
        await new Promise((res, rej) => {
          fs.mkdir(pathname, err => err ? rej(err) : res('vse chiki puki'));
        });
      } catch (e) {
        return false;
      }
    } else return false;
  }
  return true;
}

const typeIsValid = file => ['jpeg', 'jpg', 'png'].includes(file.newFilename.split('.').pop());

const addEmployee = async req => {
  const uploadsFolder = path.resolve(__dirname, '../../../uploads');
  const savedFilesFolder = path.join('public', 'savedFiles', 'employeesPhotos');

  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20 MB
    uploadDir: uploadsFolder,
  });

  const folderExists = await checkFolderExistsOrCreate(uploadsFolder);

  if (!folderExists) {
    throw new GeneralError('Проблема с загрузкой фотографии на сервер');
  }

  let photo;
  let firstName, lastName;


  try {
    await new Promise((res, rej) => form.parse(req, (err, fields, files) => {
    if (err) rej(new GeneralError('Не удалось прочитать файл'));

    photo = files.photo_path;
    
    if (!typeIsValid(photo)) rej(new GeneralError('Неправильный формат файла'));

    firstName = fields.firstName;
    lastName = fields.lastName;

    res();
  }));
  } catch (err) {
    throw err;
  }
  

  const savedFilesFolderExists = await checkFolderExistsOrCreate(savedFilesFolder);

  if (!savedFilesFolderExists) {
    throw new GeneralError('Проблема с загрузкой фотографии на сервер');
  }

  const employeePhotoFolder = path.join(savedFilesFolder, `${firstName}_${lastName}`);

  const employeePhotoFolderCreated = await checkFolderExistsOrCreate(employeePhotoFolder);

  if (!employeePhotoFolderCreated) {
    throw new GeneralError('Проблема с загрузкой фотографии на сервер');
  }

  const photoName  = photo.originalFilename.replace(/[/\\?%*:|"<>]/g, '-');

  const photo_save_path = path.join(employeePhotoFolder, photoName);

  try {
    await new Promise((res, rej) => {
      fs.rename(photo.filepath, photo_save_path, err => (
        err ? rej(err) : res('klass')
      ));
    });
  } catch (err) {
    throw new GeneralError('Проблема с сохранением фотографии');
  }

  const photo_path = photo_save_path.replace('public', '');

  const data = {
    firstName,
    lastName,
    photo_path,
  };

  const savedEmployee = await prisma.employee.create({ data });

  return savedEmployee;
};

export default addEmployee;
