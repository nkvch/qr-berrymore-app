import checkOrCreateFolder from '../apiWrapper/utils/checkOrCreateFolder';
import { IncomingForm } from 'formidable';
import path from 'path';

const typeIsValid = file => ['jpeg', 'jpg', 'png'].includes(file.newFilename.split('.').pop());

const parseFormWithPhoto = async req => {
  const uploadDir = path.resolve(__dirname, '../../../uploads');

  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20 MB
    uploadDir,
  });

  const uploadDirOk = await checkOrCreateFolder(uploadDir);

  if (!uploadDirOk) {
    throw new GeneralError('Проблема с загрузкой фотографии на сервер');
  }

  try {
    const fields = await new Promise((res, rej) => form.parse(req, (err, fields, files) => {
      if (err) rej(new GeneralError('Не удалось прочитать файл'));

      const photo = files.photoPath;
      
      if (photo && !typeIsValid(photo)) rej(new GeneralError('Неправильный формат файла'));

      res({ ...fields, ...files });
    }));

    return fields;
  } catch (err) {
    throw err;
  }
};

export default parseFormWithPhoto;
