import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { ModeEdit, Delete } from '@mui/icons-material';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/notifications';

const columns = {
  id: {
    name: 'ID',
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
  role: {
    type: 'included',
    hidden: true,
  },
};

const actions = {
  edit: {
    icon: <ModeEdit />,
    tooltip: 'Редактировать',
    action: (foreman, router) => router.push(`${router.pathname}/${foreman.id}`),
  },
  delete: {
    icon: <Delete />,
    tooltip: 'Удалить',
    action: (foreman, _, refetch, forceLoading) => {
      const dialogKey = notification.open({
        type: 'warning',
        title: 'Удаление продукта',
        text: `Вы действительно хотите удалить бригадира ${foreman.firstName} ${foreman.lastName}?`,
        actions: [{
          title: 'Удалить',
          action: () => {
            notification.close(dialogKey);

            forceLoading(true);

            request({
              url: `/users/${foreman.id}`,
              method: 'DELETE',
              callback: (status, response) => {
                if (status === 'ok') {
                  notification.open({
                    type: 'success',
                    title: 'Бригадир успешно удален',
                  });
                  refetch();
                } else {
                  notification.open({
                    type: 'error',
                    title: 'Ошибка при удалении бригадира',
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
};

const Products = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Бригадиры');
  }, []);

  return (
    <div className="block">
      <PaginatedTable
        url="/foremen"
        columns={columns}
        actions={actions}
      />
    </div>
  )
};

export default Products;
