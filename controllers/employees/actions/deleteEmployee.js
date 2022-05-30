import prisma from '../../../prisma/prismaClient/prismaClient';
import path from 'path';
import GeneralError from '../../../apiWrapper/utils/errors/generalError';
import parseFormWithPhoto from '../../parseFormWithPhoto';
import checkOrCreateFolder from '../../../apiWrapper/utils/checkOrCreateFolder';
import moveFile from '../../../apiWrapper/utils/moveFile';
import getEmployee from './getEmployee';
import deleteFolder from '../../../apiWrapper/utils/deleteFolder';

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

  const response = await prisma.employee.delete({ where: { id: Number(id) } });

  return response;
};

export default deleteEmployee;
