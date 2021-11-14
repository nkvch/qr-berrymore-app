import { TextField, Button } from "@mui/material";
import { Formik } from "formik";
import request from '../utils/request';

const singup = () => {
  const initialValues = {
    username: '',
    password: '',
    lastName: '',
    firstName: '',
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
                // id="outlined-basic"
                name="firstName"
                label="Имя"
                variant="outlined"
                onChange={handleChange}
                value={values.firstName}
              />
              <TextField
                className="form-field"
                // id="outlined-basic"
                name="lastName"
                label="Фамилия"
                variant="outlined"
                onChange={handleChange}
                value={values.lastName}
              />
              <TextField
                className="form-field"
                // id="outlined-basic"
                name="username"
                label="Имя пользователя"
                variant="outlined"
                onChange={handleChange}
                value={values.username}
              />
              <TextField
                className="form-field"
                // id="outlined-basic"
                name="password"
                label="Пароль"
                variant="outlined"
                type="password"
                onChange={handleChange}
                value={values.password}
              />
              <Button
                type="submit"
                variant="contained"
              >
                Зарегаться
              </Button>
            </form>
          )
        }
      </Formik>
    </div>
  )
};

export default singup;
