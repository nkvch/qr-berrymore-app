import { TextField, Button } from "@mui/material";
import { Formik } from "formik";
import { useContext, useEffect } from 'react';
import request from '../frontendWrapper/utils/request';
import Context from '../frontendWrapper/context';
import { notification } from "../frontendWrapper/components/notifications";
import Form from "../frontendWrapper/components/Form";

const signin = () => {
  const { login, offLoading } = useContext(Context);

  const initialValues = {
    username: '',
    password: '',
  };

  const fieldsData = {
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
      url: '/auth',
      method: 'POST',
      body: values,
      callback: (status, response) => {
        if (status === 'ok') {
          const { token, ...user } = response.data;

          login(token, user);

          notification.open({
            type: 'success',
            title: 'Вход успешно выполнен',
          });
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
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitText="Войти"
        fieldsData={fieldsData}
      />
    </div>
  )
};

export default signin;
