import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { QrCode2, ModeEdit, Delete } from '@mui/icons-material';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/notifications';

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
    action: (emp, _, refetch) => {
      const dialogKey = notification.open({
        type: 'warning',
        title: 'Удаление сотрудника',
        text: `Вы действительно хотите удалить сотрудника ${emp.firstName} ${emp.lastName}?`,
        actions: [{
          title: 'Удалить',
          action: () => {
            notification.close(dialogKey);
            request({
              url: `/employees/${emp.id}`,
              method: 'DELETE',
              callback: (status, response) => {
                if (status === 'ok') {
                  notification.open({
                    type: 'success',
                    title: 'Сотрудник успешно удален',
                  });
                  refetch();
                } else {
                  notification.open({
                    type: 'error',
                    title: 'Ошибка при удалении сотрудника',
                    text: response.message,
                  });
                };
              },
            });
          },
        }, {
          title: 'Отменить',
          action: () => notification.close(dialogKey),
        }],
      });
      window.scrollTo(0, 0);
    },
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
