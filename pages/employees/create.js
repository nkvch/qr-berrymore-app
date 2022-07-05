import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/notifications';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import Debouncer from '../../frontendWrapper/utils/debouncer';

const nameCheckDebouncer = new Debouncer(2000);

const foremanColumns = {
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
};

const fieldsData = {
  firstName: {
    label: 'Имя сотрудника',
    type: 'text',
  },
  lastName: {
    label: 'Фамилия сотрудника',
    type: 'text',
  },
  contract: {
    label: 'Номер контракта',
    type: 'text',
  },
  address: {
    label: 'Адрес',
    type: 'text',
  },
  pickUpAddress: {
    label: 'Адрес посадки',
    type: 'text',
  },
  phone: {
    label: 'Телефон',
    type: 'phone',
  },
  foremanId: {
    label: 'Выберите бригадира',
    type: 'fetch-select',
    fetchSelectConfig: {
      url: '/foremen',
      columns: foremanColumns,
      showInOption: ['firstName', 'lastName'],
      showInValue: ['firstName', 'lastName'],
      returnValue: 'id',
    }
  },
  photo: {
    label: 'Выберите или перетащите сюда фотографию',
    type: 'file',
  },
};

const CreateEmployee = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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

  const checkFirstNameAndLastName = () => {
    request({
      url: '/employees',
      searchParams: { firstName, lastName, qty: '-1' },
      callback: (status, response) => {
        if (status === 'ok') {
          const [foundData] = response.data.pageData;

          if (foundData) {
            notification.open({
              type: 'warning',
              title: `Сотрудник с именем ${foundData.firstName} ${foundData.lastName} уже существует`,
              time: 10000,
            });
          }

        } else {
          const { message } = response;

          notification.open({
            type: 'error',
            title: `Ошибка: ${message}`,
          });
        }
      },
    });
  };

  useEffect(checkFirstNameAndLastName, [firstName, lastName]);

  const updateNames = values => {
    nameCheckDebouncer.debounce(() => {
      setFirstName(values.firstName);
      setLastName(values.lastName);
    });
  };

  return (
    <div className="block">
      <Form
        onSubmit={onSubmit}
        submitText="Сохранить"
        fieldsData={fieldsData}
        className="wide"
        onChangeCallback={updateNames}
      />
    </div>
  )
};

export default CreateEmployee;
