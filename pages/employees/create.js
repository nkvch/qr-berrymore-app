import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/notifications';

const create = props => {
  const fieldsData = {
    firstName: {
      label: 'Имя сотрудника',
      type: 'text',
    },
    lastName: {
      label: 'Фамилия сотрудника',
      type: 'text',
    },
    photo_path: {
      label: 'llalal',
      type: 'text',
    }
  };

  const onSubmit = values => {
    request({
      url: '/employees',
      method: 'POST',
      body: values,
      callback: (status, response) => {
        if (status === 'ok') {
          const { firstName, lastName } = response.data;

          notification.open({
            type: 'success',
            title: `Сотрудник ${firstName} ${lastName} успешно добавлен`,
          });
        } else {
          console.log(response);
          const { message } = response.data;

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
      />
    </div>
  )
};

export default create;
