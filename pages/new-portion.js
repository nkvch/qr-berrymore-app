import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import Form from '../frontendWrapper/components/Form';
import request from '../frontendWrapper/utils/request';
import { notification } from '../frontendWrapper/components/notifications';
import router from 'next/router';

const employeeColumns = {
  id: {
    name: 'id',
    type: 'number',
  },
  photoPath: {
    name: 'Фото',
    type: 'image',
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

const productColumns = {
  id: {
    name: 'id',
    type: 'number',
  },
  photoPath: {
    name: 'Фото',
    type: 'image',
  },
  productName: {
    name: 'Имя',
    type: 'text',
  },
};

const fieldsData = {
  employeeId: {
    label: 'Выберите сотрудника',
    type: 'fetch-select',
    fetchSelectConfig: {
      url: '/employees',
      columns: employeeColumns,
      showInOption: ['photoPath', 'firstName', 'lastName'],
      showInValue: ['firstName', 'lastName'],
      returnValue: 'id',
    }
  },
  productId: {
    label: 'Выберите продукт',
    type: 'fetch-select',
    fetchSelectConfig: {
      url: '/products',
      columns: productColumns,
      showInOption: ['photoPath', 'productName'],
      showInValue: ['productName'],
      returnValue: 'id',
    }
  },
  amount: {
    label: 'Количество продукта (кг)',
    type: 'number',
  },
  dateTime: {
    label: 'Дата и время',
    type: 'datetime',
    defaultValue: new Date(),
  }
};

const AddPortion = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Новая порция');
  }, []);

  const handleSubmit = values => {
    values.dateTime = values.dateTime?.toISOString();

    request({
      url: '/history',
      method: 'POST',
      body: values,
      callback: (status, response) => {
        if (status === 'ok') {
          notification.open({
            type: 'success',
            title: 'Данные успешно записаны',
          });
          router.push('/stats');
        } else if (status === 'error') {
          notification.open({
            type: status,
            title: response.message,
          });
        }
      }
    });
  }

  return (
    <div className="block">
      <Form
        onSubmit={handleSubmit}
        submitText="Сохранить"
        fieldsData={fieldsData}
        className="wide"
      />
    </div>
  )
};

export default AddPortion;
