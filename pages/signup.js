import { TextField, Button } from "@mui/material";
import { Formik } from "formik";
import request from '../frontendWrapper/utils/request';

const signup = () => {
  const initialValues = {
    username: '',
    password: '',
    lastName: '',
    firstName: '',
    email: '',
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
    <div className="block">
      <Formik
        {...({ initialValues, onSubmit })}
      >
        {
          ({ values, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                className="form-field"
                name="firstName"
                label="Имя"
                variant="outlined"
                onChange={handleChange}
                value={values.firstName}
                type="text"
              />
              <TextField
                className="form-field"
                name="lastName"
                label="Фамилия"
                variant="outlined"
                onChange={handleChange}
                value={values.lastName}
                type="text"
              />
              <TextField
                className="form-field"
                name="email"
                label="Email"
                variant="outlined"
                onChange={handleChange}
                value={values.email}
                type="email"
              />
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

export default signup;
