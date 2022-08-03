import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { ModeEdit, Delete } from '@mui/icons-material';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/Notifications';

const columns = {
  id: {
    name: 'ID',
    type: 'number',
  },
  productName: {
    name: 'Product',
    type: 'text',
  },
  productPrice: {
    name: 'Price',
    type: 'number',
  },
  photoPath: {
    name: 'Photo',
    type: 'image',
  },
};

const actions = {
  edit: {
    icon: <ModeEdit />,
    tooltip: 'Edit',
    action: (prod, router) => router.push(`${router.pathname}/${prod.id}`),
  },
  delete: {
    icon: <Delete />,
    tooltip: 'Delete',
    action: (prod, _, refetch, forceLoading) => {
      const dialogKey = notification.open({
        type: 'warning',
        title: 'Deleting product',
        text: `Are you sure you want to delete product ${prod.productName}?`,
        actions: [{
          title: 'Delete',
          action: () => {
            notification.close(dialogKey);

            forceLoading(true);

            request({
              url: `/products/${prod.id}`,
              method: 'DELETE',
              callback: (status, response) => {
                if (status === 'ok') {
                  notification.open({
                    type: 'success',
                    title: 'Product was deleted successfully',
                  });
                  refetch();
                } else {
                  notification.open({
                    type: 'error',
                    title: 'Error while deleting product',
                    text: response.message,
                  });
                };
              },
            });
          },
        }, {
          title: 'Cancel',
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
    updateSubTitle('Products');
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
