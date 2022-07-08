import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/Notifications';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Alert } from '@mui/material';

const fieldsData = {
  firstName: {
    label: 'Имя',
    type: 'text',
  },
  lastName: {
    label: 'Фамилия',
    type: 'text',
  },
  username: {
    label: 'Логин',
    type: 'text',
  },
  password: {
    label: 'Пароль',
    type: 'text',
  },
};

const CreateForeman = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    updateSubTitle('Новый бригадир');
  }, []);

  const onSubmit = values => {
    request({
      url: '/users',
      method: 'POST',
      body: {
        ...values,
        role: 'foreman',
      },
      callback: (status, response) => {
        if (status === 'ok') {
          const { firstName, lastName } = response.data;

          notification.open({
            type: 'success',
            title: `Бригадир ${firstName} ${lastName} успешно добавлен`,
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
      <Alert style={{ width: '300px', margin: 'auto', marginBottom: '8px' }} severity="info">Логин и пароль нельзя будет изменить или подсмотреть после того как бригадир будет сохранен.</Alert>
      <Form
        onSubmit={onSubmit}
        submitText="Сохранить"
        fieldsData={fieldsData}
      />
    </div>
  )
};

export default CreateForeman;
