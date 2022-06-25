import { Autocomplete, Box, TextField, Avatar, CircularProgress, breadcrumbsClasses } from '@mui/material';
import { useState } from 'react';
import useApi from '../utils/hooks/useApi';
import Debouncer from '../utils/debouncer';
import styles from '../../styles/FetchSelect.module.scss';


const debouncer = new Debouncer(500);

const FetchSelect = props => {
  const { url, columns, label, onChange, showInOption, showInValue, style, value, returnValue, className } = props;

  const autocompleteId = `${url}fetchSelect`;

  const [search, setSearch] = useState('');

  const searchColumns = Object.entries(columns)
    .filter(([, { type }]) => ['text', 'number'].includes(type))
    .map(([key]) => key);

  const selectColumns = Object.keys(columns);

  const { loading, data } = useApi({ url }, {
    page: 1,
    qty: 10,
    search,
    searchColumns,
    selectColumns,
  });

  const renderCellContent = ([key, value]) => {
    let cell;
  
    switch (columns[key].type) {
      case 'image':
        cell = (
          <Avatar
            alt="Аватар"
            src={value}
            sx={{ width: 20, height: 20 }}
          />
        );
        break;
      default:
        cell = value;
    }

    return <div style={{ marginRight: '5px' }}>{cell}</div>;
  };

  const handleInputChange = (e, value) => {
    e?.preventDefault();

    debouncer.debounce(() => setSearch(value));

    const [clearBtn] = document.getElementById(autocompleteId).parentElement.getElementsByClassName('MuiAutocomplete-clearIndicator');
    clearBtn?.addEventListener('click', clearFetchSelect);
  };

  const clearFetchSelect = () => {
    setSearch('');
    onChange();
  };

  return (
    <Autocomplete
      id={autocompleteId}
      sx={{ marginBottom: '8px' }}
      style={style}
      options={data?.pageData || []}
      autoHighlight
      value={value}
      className={className}
      filterOptions={option => option}
      getOptionLabel={selected => {
        const fullOption = data?.pageData.find(o => o[returnValue] === selected);

        return fullOption ? showInValue.map(field => fullOption[field]).join(' ') : '';
      }}
      onChange={onChange}
      onInputChange={handleInputChange}
      loading={loading}
      loadingText="Загрузка"
      noOptionsText="Не найдено"
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} className={styles.option} {...props}>
          {
            Object.entries(option).filter(([field]) => showInOption.includes(field)).map(renderCellContent)
          }
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            // autoComplete: 'new-password', // disable autocomplete and autofill
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
};

export default FetchSelect;
