import { Formik } from 'formik';
import { TextField, Button, Autocomplete, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DroppableImageContainer from './DroppableImageContainer';
import styles from '../../styles/Form.module.scss';
import FetchSelect from './FetchSelect';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import getLocalDateTimeString from '../utils/getLocalDateTimeString';

const renderField = (fieldData, {
  values,
  handleChange: handleChangeWithoutCallback,
  onChangeCallback,
  setFieldValue: setFieldValueWithoutCallback,
}) => {
  const [field, config] = fieldData;
  const { label, type, style } = config;

  let setFieldValue;
  let handleChange;

  if (onChangeCallback) {
    setFieldValue = (_field, _value) => {
      setFieldValueWithoutCallback(_field, _value);
      onChangeCallback({
        ...values,
        [_field]: _value,
      });
    }
    handleChange = (event, ...rest) => {
      handleChangeWithoutCallback(event, ...rest);
      onChangeCallback({
        ...values,
        [event.target.name]: event.target.value,
      });
    }
  } else {
    setFieldValue = setFieldValueWithoutCallback;
    handleChange = handleChangeWithoutCallback;
  }

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
        >
          <DroppableImageContainer image={values[field]}/>
        </FileUploader>
      );
      break;
    case 'select':
      const { selectConfig: { options } } = config;

      fieldToRender = (
        <FormControl style={style}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={values[field]}
            name={field}
            label={label}
            onChange={handleChange}
          >
            {
              options.map(({ value, text }, idx) => (
                <MenuItem key={`selectitem${idx}${value}${text}`} value={value}>{text}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      )
      break;
    case 'fetch-select':
      const {
        fetchSelectConfig: { url, columns, showInOption, showInValue, returnValue, className },
        onChangeCallback,
      } = config;

      fieldToRender = (
        <FetchSelect
          style={style}
          url={url}
          columns={columns}
          label={label}
          className={className}
          onChange={(_, value) => {
            if (typeof onChangeCallback === 'function') {
              onChangeCallback(value)
            }

            if (value) {
              setFieldValue(field, value[returnValue]);
            } else {
              setFieldValue(field, undefined);
            }
          }}
          showInOption={showInOption}
          showInValue={showInValue}
          value={values[field]}
          returnValue={returnValue}
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
          style={style}
          onChange={e => {
            const localDateTimeString = e.target.value;

            setFieldValue(field, localDateTimeString ? new Date(localDateTimeString) : null);
          }}
          value={values[field] ? getLocalDateTimeString(values[field]) : null}
          type="datetime-local"
          InputLabelProps={{
            shrink: true
          }}
        />
      );
      break;
    case 'phone':
      fieldToRender = (
        <PhoneInput
          country={'by'}
          name={field}
          onChange={phoneNumber => setFieldValue(field, phoneNumber)}
          value={values[field]}
          specialLabel={label}
          isValid={(value, country) => country.iso2 === 'by' && !!value.match(/^\d{12}$/)}
          style={{
            marginBottom: '8px',
            ...(style),
          }}
          inputStyle={{
            width: '100%',
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
          style={{
            marginBottom: '8px',
            ...(style),
          }}
        />
      );
      break;
  }

  return fieldToRender;
};

const Form = ({ onSubmit, submitText, fieldsData, className, submitable, onChangeCallback, resetable, intable, resetFilters, resetText, resetStyle }) => (
  <Formik
    {...({
      initialValues: Object.fromEntries(
        Object.entries(fieldsData).map(([field, { defaultValue }]) => ([field, defaultValue || '']))
      ),
      onSubmit,
    })}
  >
    {
      ({ values, handleChange, handleSubmit, setFieldValue, resetForm }) => (
        <form
          onSubmit={handleSubmit}
          className={`${styles.form} ${className ? styles[className] : ''}`}
        >
          { 
            Object.entries(fieldsData).map(
              fieldData => renderField(fieldData, { values, handleChange, setFieldValue, onChangeCallback })
            )
          }
          {
            submitable !== false && (
              <Button
                type="submit"
                variant="contained"
                className={styles['form-submit']}
              >
                {submitText}
              </Button>
            )
          }
          {
            (resetable || intable) ? (
              <Button
                type="reset"
                variant="outlined"
                color="warning"
                style={{ marginBottom: '8px', ...(resetStyle)}}
                onClick={() => {
                  resetForm();

                  if (intable) {
                    resetFilters();
                  }
                }}
              >
                {resetText}
              </Button>
            ) : null
          }
        </form>
      )
    }
  </Formik>
);

export default Form;
