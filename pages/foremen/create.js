import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/Notifications';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Alert } from '@mui/material';

const fieldsData = {
  firstName: {
    label: 'First Name',
    type: 'text',
  },
  lastName: {
    label: 'Last Name',
    type: 'text',
  },
  username: {
    label: 'Username',
    type: 'text',
  },
  password: {
    label: 'Password',
    type: 'text',
  },
};

const CreateForeman = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    updateSubTitle('New foreman');
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
            title: `Foreman ${firstName} ${lastName} was successfully added`,
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

  return (
    <div className="block">
      <Alert style={{ width: '300px', margin: 'auto', marginBottom: '8px' }} severity="info">Username and password won&apos;t be editable after you save it.</Alert>
      <Form
        onSubmit={onSubmit}
        submitText="Save"
        fieldsData={fieldsData}
      />
    </div>
  )
};

export default CreateForeman;
