import Form from "../frontendWrapper/components/Form";
import request from '../frontendWrapper/utils/request';
import Context from '../frontendWrapper/context';
import { useContext, useEffect } from "react";
import { notification } from '../frontendWrapper/components/notifications';
import { useRouter } from 'next/router';

const SignUp = () => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    updateSubTitle('Регистрация');
  }, []);

  const initialValues = {
    username: '',
    password: '',
    lastName: '',
    firstName: '',
    email: '',
  };

  const fieldsData = {
    firstName: {
      label: 'Имя',
      type: 'text',
    },
    lastName: {
      label: 'Фамилия',
      type: 'text',
    },
    email: {
      label: 'Email',
      type: 'email',
    },
    username: {
      label: 'Имя пользователя',
      type: 'text',
    },
    password: {
      label: 'Пароль',
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
            title: 'Успешная регистрация',
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
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitText="Зарегистрироваться"
        fieldsData={fieldsData}
      />
    </div>
  )
};

export default SignUp;
