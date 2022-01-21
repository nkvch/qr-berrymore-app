import { TextField, Button } from "@mui/material";
import { Formik } from "formik";
import Form from "../frontendWrapper/components/Form";
import request from '../frontendWrapper/utils/request';
import Context from '../frontendWrapper/context';
import { useContext, useEffect } from "react";

const signup = () => {
  const { updateAddTitle } = useContext(Context);

  useEffect(() => {
    updateAddTitle('Регистрация');
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
        if (status === 'OK') {
          console.log(response);
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

export default signup;
