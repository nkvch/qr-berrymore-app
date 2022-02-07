import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/notifications';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';

const fieldsData = {
  firstName: {
    label: 'Имя сотрудника',
    type: 'text',
  },
  lastName: {
    label: 'Фамилия сотрудника',
    type: 'text',
  },
  photo: {
    label: 'Выберите или перетащите сюда фотографию',
    type: 'file',
  },
};

const CreateEmployee = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    updateSubTitle('Новый сотрудник');
  }, []);

  const onSubmit = values => {
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );

    request({
      url: '/employees',
      method: 'POST',
      body: formData,
      withFiles: true,
      callback: (status, response) => {
        if (status === 'ok') {
          const { firstName, lastName } = response.data;

          notification.open({
            type: 'success',
            title: `Сотрудник ${firstName} ${lastName} успешно добавлен`,
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
      <Form
        onSubmit={onSubmit}
        submitText="Сохранить"
        fieldsData={fieldsData}
        className="wide"
      />
    </div>
  )
};

export default CreateEmployee;
