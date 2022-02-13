import { Autocomplete, Box, TextField, Avatar, CircularProgress, breadcrumbsClasses } from '@mui/material';
import { useState } from 'react';
import useApi from '../utils/hooks/useApi';
import Debouncer from '../utils/debouncer';
import styles from '../../styles/FetchSelect.module.scss';


const debouncer = new Debouncer(500);

const FetchSelect = props => {
  const { url, columns, label, onChange, showInOption, showInValue } = props;

  const [search, setSearch] = useState('');

  const searchTextColumns = Object.entries(columns)
    .filter(([, { type }]) => type === 'text')
    .map(([key]) => key);

  const searchNumberColumns = Object.entries(columns)
    .filter(([, { type }]) => type === 'number')
    .map(([key]) => key);

  const selectColumns = Object.keys(columns);

  const { loading, data } = useApi({ url }, {
    page: 1,
    qty: 10,
    search,
    searchTextColumns,
    searchNumberColumns,
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
    e.preventDefault();

    debouncer.debounce(() => setSearch(value));
  };

  return (
    <Autocomplete
      id={`${url}fetchSelect`}
      sx={{ marginBottom: '8px' }}
      options={data?.pageData || []}
      autoHighlight
      filterOptions={option => option}
      getOptionLabel={selected => showInValue.map(field => selected[field]).join(' ')}
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
