import { useRouter } from 'next/router';
import useApi from '../../../frontendWrapper/utils/hooks/useApi';
import { notification } from '../../../frontendWrapper/components/notifications';
import { useEffect, useContext } from 'react';
import { CircularProgress } from '@mui/material';
import Context from '../../../frontendWrapper/context';
import Form from '../../../frontendWrapper/components/Form';
import request from '../../../frontendWrapper/utils/request';

const url = '/employees';

const employeeFlags = [
  { value: 'isWorking', text: 'Работает' },
  { value: 'printedQR', text: 'QR распечатан' },
  { value: 'blacklisted', text: 'Черный список' },
  { value: 'goodWorker', text: 'Хороший работник' },
  { value: 'workedBefore', text: 'Работал прежде' },
  { value: 'wontWork', text: 'Не будет работать' },
];

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

const getFieldsData = employeeData => ({
  firstName: {
    label: 'Имя сотрудника',
    type: 'text',
    defaultValue: employeeData?.firstName,
  },
  lastName: {
    label: 'Фамилия сотрудника',
    type: 'text',
    defaultValue: employeeData?.lastName,
  },
  contract: {
    label: 'Нумар кантракту',
    type: 'text',
    defaultValue: employeeData?.contract,
  },
  address: {
    label: 'Адрас',
    type: 'text',
    defaultValue: employeeData?.address,
  },
  pickUpAddress: {
    label: 'Адрес посадки',
    type: 'text',
    defaultValue: employeeData?.pickUpAddress,
  },
  phone: {
    label: 'Тэлефон',
    type: 'phone',
    defaultValue: employeeData?.phone,
  },
  additionalPhone: {
    label: 'Дополнительный телефон (необязательно)',
    type: 'phone',
    defaultValue: employeeData?.additionalPhone,
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
    },
    defaultValue: employeeData?.foremanId,
  },
  flags: {
    label: 'Флаги',
    type: 'multiple-select',
    defaultValue: employeeData ? Object.entries(employeeData).filter(([key, value]) => employeeFlags
      .map(flag => flag.value)
      .includes(key) && value === true)
      .map(([key]) => key) : [],
    multipleSelectConfig: {
      multipleOptions: employeeFlags,
    },
    style: { marginBottom: '8px' },
  },
  photo: {
    label: 'Выберите или перетащите сюда фотографию',
    type: 'file',
    defaultValue: employeeData?.photoPath,
  },
});

const EditEmployee = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();
  const { id } = router.query;

  const disableFetching = !id;

  const { loading, data, fetchError } = useApi({
    url: `${url}/${id}`,
  }, {}, disableFetching);

  useEffect(() => {
    updateSubTitle('Редактирование сотрудника');
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
    const withNewPhoto = values.photo instanceof File;
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'flags') {
        employeeFlags.forEach(flag => {
          formData.append(flag.value, value.includes(flag.value));
        });
      } else {
        formData.append(key, value);
      }
    });

    if (!withNewPhoto) {
      formData.delete('photo');
    }

    request({
      url: `${url}/${id}`,
      method: 'PUT',
      body: formData,
      withFiles: true,
      callback: (status, response) => {
        if (status === 'ok') {
          const { firstName, lastName } = response.data;

          notification.open({
            type: 'success',
            title: `Данные о сотруднике ${firstName} ${lastName} успешно обновлены`,
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
  };

  return <div className="block">
    {
      loading
        ? <CircularProgress className="loading-spinner" />
        : (
          <Form
            onSubmit={onSubmit}
            submitText="Сохранить"
            fieldsData={getFieldsData(data)}
            className="wide"
          />
        )
    }
    </div>
};

export default EditEmployee;
