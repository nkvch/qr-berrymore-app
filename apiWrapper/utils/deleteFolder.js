import fs from 'fs';

const deleteFolder = folderPath => {
  fs.rmSync(folderPath, { force: true, recursive: true });
};

export default deleteFolder;
