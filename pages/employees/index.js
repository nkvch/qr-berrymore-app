import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { QrCode2, ModeEdit, Delete } from '@mui/icons-material';

const url = '/employees';

const columns = {
  id: {
    name: 'ID',
    type: 'number',
  },
  firstName: {
    name: 'Имя',
    type: 'text',
  },
  lastName: {
    name: 'Фамилия',
    type: 'text',
  },
  photoPath: {
    name: 'Фото',
    type: 'image',
  },
};

const actions = {
  edit: {
    icon: <ModeEdit />,
    tooltip: 'Редактировать',
    action: (emp, router) => router.push(`${router.pathname}/${emp.id}`),
  },
  delete: {
    icon: <Delete />,
    tooltip: 'Удалить',
    action: () => {},
  },
  qrcode: {
    icon: <QrCode2 />,
    tooltip: 'Показать QR-код',
    action: (emp, router) => router.push(`${router.pathname}/${emp.id}/qrcode`),
  },
};

const Employees = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Сотрудники');
  }, []);

  return (
    <div className="block">
      <PaginatedTable
        url={url}
        columns={columns}
        actions={actions}
      />
    </div>
  )
};

export default Employees;
