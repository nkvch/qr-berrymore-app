import { Formik } from 'formik';
import { TextField, Button, Autocomplete } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DroppableImageContainer from './DroppableImageContainer';
import styles from '../../styles/Form.module.scss';

const renderField = (fieldData, { values, handleChange, setFieldValue }) => {
  const [field, { label, type }] = fieldData;

  let fieldToRender;

  switch (type) {
    case 'file':
      fieldToRender = (
        <FileUploader
          handleChange={file => setFieldValue(field, file)}
          label={label}
          name={field}
          hoverTitle="Отпускайте"
          types={['JPG', 'PNG', 'GIF']}
          children={<DroppableImageContainer file={values[field]}/>}
        />
      );
      break;
    case 'select':
      fieldToRender = (
        <Autocomplete
          freeSolo
          id={`${field}-select`}
          options={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Поиск..."
              onChange={handleChangeSearch}
            />
          )}
        />
      );
    default:
      fieldToRender = (
        <TextField
          className={styles['form-field']}
          name={field}
          label={label}
          variant="outlined"
          onChange={handleChange}
          value={values[field]}
          type={type}
        />
      );
      break;
  }

  return fieldToRender;
};

const Form = ({ onSubmit, submitText, fieldsData, className }) => (
  <Formik
    {...({
      initialValues: Object.fromEntries(
        Object.entries(fieldsData).map(([field, _]) => ([field, '']))
      ),
      onSubmit,
    })}
  >
    {
      ({ values, handleChange, handleSubmit, setFieldValue }) => (
        <form
          onSubmit={handleSubmit}
          className={`${styles.form} ${className ? styles[className] : ''}`}
        >
          { 
            Object.entries(fieldsData).map(
              fieldData => renderField(fieldData, { values, handleChange, setFieldValue })
            ) 
          }
          <Button
            type="submit"
            variant="contained"
            className={styles['form-submit']}
          >
            {submitText}
          </Button>
        </form>
      )
    }
  </Formik>
);

export default Form;
