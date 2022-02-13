import { Autocomplete, Box, TextField, Avatar, CircularProgress, breadcrumbsClasses } from '@mui/material';
import { useState } from 'react';
import useApi from '../utils/hooks/useApi';
import Debouncer from '../utils/debouncer';

const debouncer = new Debouncer(500);

const FetchSelect = props => {
  const { url, columns, placeholder, renderSelected } = props;

  const [search, setSearch] = useState('');

  const searchTextColumns = Object.entries(columns)
    .filter(([, { type }]) => type === 'text')
    .map(([key]) => key);

  const searchNumberColumns = Object.entries(columns)
    .filter(([, { type }]) => type === 'number')
    .map(([key]) => key);

  const selectColumns = Object.keys(columns);

  const { loading, data, fetchError } = useApi({ url }, {
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
      id="country-select-demo2"
      sx={{ width: 300, marginBottom: '8px' }}
      options={data?.pageData || []}
      autoHighlight
      filterOptions={option => option}
      getOptionLabel={renderSelected}
      onInputChange={handleInputChange}
      loading={loading}
      loadingText="Загрузка"
      noOptionsText="Не найдено"
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          {
            Object.entries(option).map(renderCellContent)
          }
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
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
