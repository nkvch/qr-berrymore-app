import checkOrCreateFolder from '../apiWrapper/utils/checkOrCreateFolder';
import { IncomingForm } from 'formidable';
import GeneralError from '../apiWrapper/utils/errors/generalError';
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
    throw new GeneralError('Problem has occured while trying to upload image');
  }

  try {
    const fields = await new Promise((res, rej) => form.parse(req, (err, fields, files) => {
      if (err) rej(new GeneralError('Unable to read the file'));

      const photo = files.photo;
      
      if (photo && !typeIsValid(photo)) rej(new GeneralError('Invalid file format'));

      res({ ...fields, ...files });
    }));

    return fields;
  } catch (err) {
    throw err;
  }
};

export default parseFormWithPhoto;
