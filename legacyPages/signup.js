import Form from "../frontendWrapper/components/Form";
import request from '../frontendWrapper/utils/request';
import Context from '../frontendWrapper/context';
import { useContext, useEffect } from "react";
import { notification } from '../frontendWrapper/components/Notifications';
import { useRouter } from 'next/router';

const SignUp = () => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    updateSubTitle('New account');
  }, []);

  const fieldsData = {
    firstName: {
      label: 'First Name',
      type: 'text',
    },
    lastName: {
      label: 'Last Name',
      type: 'text',
    },
    email: {
      label: 'Email',
      type: 'email',
    },
    username: {
      label: 'Username',
      type: 'text',
    },
    password: {
      label: 'Password',
      type: 'password',
    },
  };

  const onSubmit = values => {
    request({
      url: '/users',
      method: 'POST',
      body: values,
      callback: (status, response) => {
        if (status === 'ok') {

          notification.open({
            type: 'success',
            title: 'Successfully created new account',
          });
          router.push('/signin');
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
    <div className="block content-center">
      <Form
        onSubmit={onSubmit}
        submitText="Create account"
        fieldsData={fieldsData}
      />
    </div>
  )
};

export default SignUp;
