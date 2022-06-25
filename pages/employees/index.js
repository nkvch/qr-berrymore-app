import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect, useState } from 'react';
import { QrCode2, ModeEdit, Delete } from '@mui/icons-material';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/notifications';
import { CircularProgress } from '@mui/material';

const url = '/employees';

const columns = {
  id: {
    name: 'ID',
    type: 'number',
    hidden: true,
  },
  contract: {
    name: 'Номер кантракта',
    type: 'text',
  },
  foremanId: {
    type: 'number',
    hidden: true,
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
  foreman: {
    name: 'Бригадир',
    type: 'included',
    parse: foreman => foreman ? `${foreman.firstName} ${foreman.lastName}` : 'Нет данных',
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
    action: (emp, _, refetch, forceLoading) => {
      const dialogKey = notification.open({
        type: 'warning',
        title: 'Удаление сотрудника',
        text: `Вы действительно хотите удалить сотрудника ${emp.firstName} ${emp.lastName}?`,
        actions: [{
          title: 'Удалить',
          action: () => {
            notification.close(dialogKey);

            forceLoading(true);

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

  const [foreman, setForeman] = useState(null);

  const filters = {
    fieldsData: {
      foremanId: {
        label: 'Фильтровать по бригаде',
        type: 'fetch-select',
        fetchSelectConfig: {
          url: '/foremen',
          className: 'autocomplete-inline-flex',
          columns: {
            id: {
              name: 'id',
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
          },
          showInOption: ['firstName', 'lastName'],
          showInValue: ['firstName', 'lastName'],
          returnValue: 'id',
        },
        onChangeCallback: data => {
          setForeman(data ? { foremanId: data?.id } : null);
        },
      },
    },
    className: 'inline-form',
    submitable: false,
  };

  return (
    <div className="block">
      <PaginatedTable
        url={url}
        columns={columns}
        actions={actions}
        filters={filters}
        customFilters={foreman}
        classNames={{
          autocomplete: 'search70width',
        }}
      />
    </div>
  )
};

export default Employees;
