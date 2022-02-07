import fs from 'fs';

const checkOrCreateFolder = async pathname => {
  let success = false;

  try {
    success = await new Promise((res, rej) => {
      fs.stat(pathname, err => err ? rej(err) : res(true));
    });
  } catch (err) {
    if (err?.code === 'ENOENT') {
      try {
        success = await new Promise((res, rej) => {
          fs.mkdir(pathname, err => err ? rej(err) : res(true));
        });
      } catch (e) {
        return success;
      }
    }
  }

  return success;
};

export default checkOrCreateFolder;
