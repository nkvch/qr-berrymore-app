import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { ModeEdit, Delete } from '@mui/icons-material';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/Notifications';

const columns = {
  firstName: {
    name: 'First Name',
    type: 'text',
  },
  lastName: {
    name: 'Last Name',
    type: 'text',
  },
};

const hiddenButRequiredData = ['id'];

const actions = {
  edit: {
    icon: <ModeEdit />,
    tooltip: 'Edit',
    action: (foreman, router) => router.push(`${router.pathname}/${foreman.id}`),
  },
  delete: {
    icon: <Delete />,
    tooltip: 'Delete',
    action: (foreman, _, refetch, forceLoading) => {
      const dialogKey = notification.open({
        type: 'warning',
        title: 'Deleting product',
        text: `Are you sure you want to delete foreman ${foreman.firstName} ${foreman.lastName}?`,
        actions: [{
          title: 'Delete',
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
                    title: 'Foreman was deleted successfully',
                  });
                  refetch();
                } else {
                  notification.open({
                    type: 'error',
                    title: 'Error while deleting foreman',
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
    updateSubTitle('Foremen');
  }, []);

  return (
    <div className="block">
      <PaginatedTable
        url="/foremen"
        columns={columns}
        actions={actions}
        hiddenButRequiredData={hiddenButRequiredData}
      />
    </div>
  )
};

export default Products;
