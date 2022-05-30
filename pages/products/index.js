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
  },
  productName: {
    name: 'Продукт',
    type: 'text',
  },
  productPrice: {
    name: 'Цена',
    type: 'number',
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
    action: (prod, router) => router.push(`${router.pathname}/${prod.id}`),
  },
  delete: {
    icon: <Delete />,
    tooltip: 'Удалить',
    action: (prod, _, refetch) => {
      const dialogKey = notification.open({
        type: 'warning',
        title: 'Удаление продукта',
        text: `Вы действительно хотите удалить продукт ${prod.productName}?`,
        actions: [{
          title: 'Удалить',
          action: () => {
            notification.close(dialogKey);
            request({
              url: `/products/${prod.id}`,
              method: 'DELETE',
              callback: (status, response) => {
                if (status === 'ok') {
                  notification.open({
                    type: 'success',
                    title: 'Продукт успешно удален',
                  });
                  refetch();
                } else {
                  notification.open({
                    type: 'error',
                    title: 'Ошибка при удалении продукта',
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
    updateSubTitle('Продукты');
  }, []);

  return (
    <div className="block">
      <PaginatedTable
        url="/products"
        columns={columns}
        actions={actions}
      />
    </div>
  )
};

export default Products;
