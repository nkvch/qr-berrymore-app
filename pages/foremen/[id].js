import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/Notifications';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';
import useApi from '../../frontendWrapper/utils/hooks/useApi';
import { CircularProgress } from '@mui/material';

const url = '/foremen';

const getFieldsData = data => ({
  firstName: {
    label: 'Имя',
    type: 'text',
    defaultValue: data?.firstName,
  },
  lastName: {
    label: 'Фамилия',
    type: 'text',
    defaultValue: data?.lastName,
  },
});

const UpdateForeman = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();
  const { id } = router.query;

  const disableFetching = !id;

  const { loading, data, fetchError } = useApi({
    url: `${url}/${id}`,
  }, {}, disableFetching);

  useEffect(() => {
    updateSubTitle('Редактирование бригадира');
  }, []);

  useEffect(() => {
    if (fetchError) {
      notification.open({
        type: 'error',
        title: `Ошибка: ${fetchError}`,
      });
    }
  }, [fetchError]);

  const onSubmit = values => {
    request({
      url: `/foremen/${id}`,
      method: 'PUT',
      body: values,
      callback: (status, response) => {
        if (status === 'ok') {
          const { firstName, lastName } = response.data;

          notification.open({
            type: 'success',
            title: `Информация о бригадире ${firstName} ${lastName} успешно обновлена`,
          });

          router.back();
        } else {
          const { message } = response;

          notification.open({
            type: 'error',
            title: `Ошибка: ${message}`,
          });
        }
      },
    });
  }

  return (
    <div className="block">
      {
        loading
          ? <CircularProgress className="loading-spinner" />
          : (
            <Form
              onSubmit={onSubmit}
              submitText="Сохранить"
              fieldsData={getFieldsData(data)}
            />
          )
      }
    </div>
  )
};

export default UpdateForeman;
