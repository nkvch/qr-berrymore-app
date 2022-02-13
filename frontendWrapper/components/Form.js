import { Formik } from 'formik';
import { TextField, Button, Autocomplete } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DroppableImageContainer from './DroppableImageContainer';
import styles from '../../styles/Form.module.scss';
import FetchSelect from './FetchSelect';

const renderField = (fieldData, { values, handleChange, setFieldValue }) => {
  const [field, config] = fieldData;
  const { label, type } = config;

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
    case 'fetch-select':
      const {
        fetchSelectConfig: { url, columns, showInOption, showInValue, returnValue },
      } = config;

      fieldToRender = (
        <FetchSelect
          url={url}
          columns={columns}
          label={label}
          onChange={(_, value) => {
            if (value) {
              setFieldValue(field, value[returnValue]);
            } else {
              setFieldValue(field, undefined);
            }
          }}
          showInOption={showInOption}
          showInValue={showInValue}
        />
      );

      break;
    case 'datetime':
      fieldToRender = (
        <TextField
          className={styles['form-field']}
          name={field}
          label={label}
          variant="outlined"
          onChange={handleChange}
          value={values[field]}
          type="datetime-local"
          InputLabelProps={{
            shrink: true
          }}
        />
      );
      break;
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
        Object.entries(fieldsData).map(([field, { defaultValue }]) => ([field, defaultValue || '']))
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
