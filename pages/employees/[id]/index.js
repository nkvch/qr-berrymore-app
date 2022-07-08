import { useRouter } from 'next/router';
import useApi from '../../../frontendWrapper/utils/hooks/useApi';
import { notification } from '../../../frontendWrapper/components/Notifications';
import { useEffect, useContext } from 'react';
import { CircularProgress } from '@mui/material';
import Context from '../../../frontendWrapper/context';
import Form from '../../../frontendWrapper/components/Form';
import request from '../../../frontendWrapper/utils/request';

const url = '/employees';

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

    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );

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
