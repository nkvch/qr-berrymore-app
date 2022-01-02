import { Formik } from 'formik';
import { TextField, Button } from '@mui/material';

const Form = ({ onSubmit, submitText, fieldsData }) => (
  <Formik
    {...({
      initialValues: Object.fromEntries(
        Object.entries(fieldsData).map(([field, _]) => ([field, '']))
      ),
      onSubmit,
    })}
  >
    {
      ({ values, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          {
            Object.entries(fieldsData).map(([field, { label, type }]) => (
              <TextField
                className="form-field"
                name={field}
                label={label}
                variant="outlined"
                onChange={handleChange}
                value={values[field]}
                type={type}
              />
            ))
          }
          <Button
            type="submit"
            variant="contained"
          >
            {submitText}
          </Button>
        </form>
      )
    }
  </Formik>
);

export default Form;
