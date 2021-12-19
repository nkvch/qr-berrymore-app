import { TextField, Button } from "@mui/material";
import { Formik } from "formik";
import { useContext } from 'react';
import request from '../frontendWrapper/utils/request';
import Context from '../frontendWrapper/context';
import { notification } from "../frontendWrapper/components/notifications";

const signin = () => {
  const { login } = useContext(Context);

  const initialValues = {
    username: '',
    password: '',
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
      <Formik
        {...({ initialValues, onSubmit })}
      >
        {
          ({ values, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                className="form-field"
                name="username"
                label="Имя пользователя"
                variant="outlined"
                onChange={handleChange}
                value={values.username}
                type="text"
              />
              <TextField
                className="form-field"
                name="password"
                label="Пароль"
                variant="outlined"
                onChange={handleChange}
                value={values.password}
                type="password"
              />
              <Button
                type="submit"
                variant="contained"
              >
                Зарегистрироваться
              </Button>
            </form>
          )
        }
      </Formik>
    </div>
  )
};

export default signin;
