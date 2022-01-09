import { Formik } from 'formik';
import { TextField, Button } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DroppableImageContainer from './DroppableImageContainer';
import styles from '../../styles/Form.module.scss';

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
            Object.entries(fieldsData).map(([field, { label, type }]) => (
              type === 'file'
                ? (
                  <FileUploader
                    handleChange={file => setFieldValue(field, file)}
                    label={label}
                    name={field}
                    hoverTitle="Отпускайте"
                    types={['JPG', 'PNG', 'GIF']}
                    children={<DroppableImageContainer file={values[field]}/>}
                  />
                )
                : (
                  <TextField
                    className={styles['form-field']}
                    name={field}
                    label={label}
                    variant="outlined"
                    onChange={handleChange}
                    value={values[field]}
                    type={type}
                  />
                )
            ))
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
