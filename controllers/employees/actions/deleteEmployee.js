import path from 'path';
import getEmployee from './getEmployee';
import deleteFolder from '../../../apiWrapper/utils/deleteFolder';
import db from '../../../db/models';

const deleteEmployee = async req => {
  const { id, photoPath } = await getEmployee(req);

  if (photoPath) {
    const employeePhotoFolderPath = path.join('public', photoPath
      .split('/')
      .slice(0, 4)
      .join('/')
    );

    deleteFolder(employeePhotoFolderPath);
  }

  const response = await db.employees.destroy({ where: { id: Number(id) } });

  return response;
};

export default deleteEmployee;
