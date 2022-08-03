import { useRouter } from 'next/router';
import useApi from '../../../frontendWrapper/utils/hooks/useApi';
import { notification } from '../../../frontendWrapper/components/Notifications';
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
  { value: 'called', text: 'Звонили' },
];

const foremanColumns = {
  id: {
    name: 'id',
    type: 'number',
  },
  firstName: {
    name: 'First Name',
    type: 'text',
  },
  lastName: {
    name: 'Last Name',
    type: 'text',
  },
};

const getFieldsData = employeeData => ({
  firstName: {
    label: 'Name of the employee',
    type: 'text',
    defaultValue: employeeData?.firstName,
  },
  lastName: {
    label: 'Last name of the employee',
    type: 'text',
    defaultValue: employeeData?.lastName,
  },
  contract: {
    label: 'Contract #',
    type: 'text',
    defaultValue: employeeData?.contract,
  },
  address: {
    label: 'Address',
    type: 'text',
    defaultValue: employeeData?.address,
  },
  pickUpAddress: {
    label: 'Pick up address',
    type: 'text',
    defaultValue: employeeData?.pickUpAddress,
  },
  phone: {
    label: 'Phone',
    type: 'phone',
    defaultValue: employeeData?.phone,
  },
  foremanId: {
    label: 'Choose foreman',
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
    label: 'Flags',
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
    label: 'Choose or drop photo here',
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
    updateSubTitle('Edit employee');
  }, []);

  useEffect(() => {
    if (fetchError) {
      notification.open({
        type: 'error',
        title: `Error: ${fetchError}`,
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
            title: `Employee ${firstName} ${lastName} was successfully updated`,
          });

          router.back();
        } else {
          const { message } = response;

          notification.open({
            type: 'error',
            title: `Error: ${message}`,
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
            submitText="Save"
            fieldsData={getFieldsData(data)}
            className="wide"
          />
        )
    }
    </div>
};

export default EditEmployee;
