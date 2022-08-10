import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/Notifications';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import Debouncer from '../../frontendWrapper/utils/debouncer';

const nameCheckDebouncer = new Debouncer(2000);

const employeeFlags = [
  { value: 'isWorking', text: 'Works' },
  { value: 'printedQR', text: 'QR printed' },
  { value: 'blacklisted', text: 'Blacklisted' },
  { value: 'goodWorker', text: 'Good worker' },
  { value: 'workedBefore', text: 'Worked before' },
  { value: 'wontWork', text: 'Don\'t work' },
  { value: 'called', text: 'Called' },
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

const fieldsData = {
  firstName: {
    label: 'Name of the employee',
    type: 'text',
  },
  lastName: {
    label: 'Last Name employee',
    type: 'text',
  },
  contract: {
    label: 'Contract #',
    type: 'text',
  },
  address: {
    label: 'Address',
    type: 'text',
  },
  pickUpAddress: {
    label: 'Pick up address',
    type: 'text',
  },
  phone: {
    label: 'Phone',
    type: 'phone',
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
    }
  },
  flags: {
    label: 'Flags',
    type: 'multiple-select',
    defaultValue: [],
    multipleSelectConfig: {
      multipleOptions: employeeFlags,
    },
    style: { marginBottom: '8px' },
  },
  photo: {
    label: 'Choose or drop photo here',
    type: 'file',
  },
};

const CreateEmployee = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    updateSubTitle('New Employee');
  }, []);

  const onSubmit = values => {
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
            title: `Employee ${firstName} ${lastName} was successfully added`,
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
              title: `Employee named ${foundData.firstName} ${foundData.lastName} already exists`,
              time: 10000,
            });
          }

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
        submitText="Save"
        fieldsData={fieldsData}
        className="wide"
        onChangeCallback={updateNames}
      />
    </div>
  )
};

export default CreateEmployee;
