import fs from 'fs';

const moveFile = (oldPath, newPath) => new Promise((res, rej) => {
  fs.rename(oldPath, newPath, err => (
    err ? res(false) : res(true)
  ));
});

export default moveFile;
