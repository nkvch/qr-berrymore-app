import { Autocomplete, Box, TextField, Avatar } from '@mui/material';
import { useState } from 'react';
import useApi from '../utils/hooks/useApi';

const FetchSelect = props => {
  const { url, columns } = props;

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
    switch (columns[key].type) {
      case 'image':
        return (
          <Avatar
            alt="Аватар"
            src={value}
            sx={{ width: 20, height: 20 }}
          />
        );
      default:
        return value;
    }
  };

  const handleInputChange = e => {
    e.preventDefault();

    setSearch(e.target.value);
  };

  return (
    <Autocomplete
      id="country-select-demo"
      sx={{ width: 300 }}
      options={data?.pageData || []}
      autoHighlight
      getOptionLabel={(option) => option.label}
      onInputChange={handleInputChange}
      loading={loading}
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
          label="Choose a country"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
};

export default FetchSelect;
