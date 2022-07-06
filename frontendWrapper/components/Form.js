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
import applyCallbackIfExists from '../utils/applyCallback';
import useTheme from '../utils/hooks/useTheme';

const renderField = (fieldData, {
  values,
  handleChange: handleChangeWithoutCallback,
  onChangeCallback,
  setFieldValue: setFieldValueWithoutCallback,
  theme,
}) => {
  const [field, config] = fieldData;
  const { label, type, style } = config;

  const setFieldValueCb = onChangeCallback ? (_field, _value) => onChangeCallback({
    ...values,
    [_field]: _value,
  }) : null;

  const handleChangeCb = onChangeCallback ? ev => onChangeCallback({
    ...values,
    [ev.target.name]: ev.target.value,
  }) : null

  const setFieldValue = applyCallbackIfExists(setFieldValueWithoutCallback, setFieldValueCb);
  const handleChange = applyCallbackIfExists(handleChangeWithoutCallback, handleChangeCb);

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
          <DroppableImageContainer image={values[field]} theme={theme} />
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
          className={theme}
          isValid={(value, country) => country.iso2 === 'by' && !!value.match(/^\d{12}$/)}
          style={{
            marginBottom: '8px',
            ...(style),
          }}
          inputStyle={{
            width: '100%',
            ...(theme === 'dark' && {
              backgroundColor: '#121212',
              color: 'white',
            }),
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

const Form = ({ onSubmit, submitText, fieldsData, className, submitable, onChangeCallback, resetable, intable, resetFilters, resetText, resetStyle }) => {
  const theme = useTheme();

  return (
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
                fieldData => renderField(fieldData, { values, handleChange, setFieldValue, onChangeCallback, theme })
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
                      onChangeCallback(Object.fromEntries(
                        Object.entries(fieldsData).map(([field, { defaultValue }]) => ([field, defaultValue || '']))
                      ));
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
}

export default Form;
