import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Paper,
  CircularProgress,
  Autocomplete,
  TextField,
  Button,
  Avatar,
  Tooltip,
  Chip,
  Grid,
} from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';
import {
  LastPage as LastPageIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft, 
  KeyboardArrowRight,
} from '@mui/icons-material';
import { notification } from './Notifications';
import { useState, useEffect, useRef } from 'react';
import Debouncer from '../utils/debouncer';
import { useRouter } from 'next/router';
import useApi from '../utils/hooks/useApi';
import Form from './Form';
// import styles from '../../styles/PaginatedTable.module.scss';

const debouncer = new Debouncer(500);

const PaginatedTable = props => {
  const { url, columns, hiddenButRequiredData = [], actions, noSearch, searchStyle, customFilters, customAddButton, filters, classNames, pageActions, chips, tableChips } = props;

  const [page, setPage] = useState(1);
  const [qty, setQty] = useState(10);
  const [search, setSearch] = useState('');

  const searchInputId = `${url.split('/').pop()}-search`;

  const router = useRouter();

  const searchColumns = Object.entries(columns)
    .filter(([, { type }]) => ['text', 'number'].includes(type))
    .map(([key]) => key);

  const selectColumns = Object.entries(columns)
    .filter(([, { type }]) => type !== 'included')
    .map(([key]) => key)
    .concat(hiddenButRequiredData);

  const { loading, data, fetchError, refetch, forceLoading } = useApi({ url }, {
    page,
    qty,
    search,
    searchColumns,
    selectColumns,
    ...(customFilters),
  });

  const rows = data?.pageData || [];
  const total = data?.total;

  useEffect(() => {
    const qtyFromLS = localStorage.getItem(`${url.split('/').pop()}qty`);
    if (qtyFromLS) {
      setQty(Number(qtyFromLS));
    }
  }, [url]);

  useEffect(() => {
    if (fetchError) {
      notification.open({
        type: 'error',
        title: `Ошибка: ${fetchError}`,
      });
    }
  }, [fetchError]);

  useEffect(() => {
    if (total === 0) {
      notification.open({
        type: 'warning',
        title: 'Результаты не найдены',
      });
    }
  }, [total]);

  const handleChangePage = page => {
    setPage(page);
  };

  const handleChangeRowsPerPage = event => {
    const newQty = Number(event.target.value);
    localStorage.setItem(`${url.split('/').pop()}qty`, newQty);
    setQty(newQty);
    setPage(1);
  };

  const handleChangeSearch = event => {
    const { value } = event.target;

    debouncer.debounce(() => {
      setSearch(value);
      setPage(1);
    });

    const [clearBtn] = document.getElementById(searchInputId).parentElement.getElementsByClassName('MuiAutocomplete-clearIndicator');
    clearBtn?.addEventListener('click', clearSearch);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const filterHiddenFields = ([key]) => !!columns[key];

  const sortColumns = ([key1], [key2]) => Object.keys(columns).indexOf(key1) - Object.keys(columns).indexOf(key2);

  const renderCellContend = (key, value) => {
    switch (columns[key]?.type) {
      case 'image':
        return (
          <Avatar
            alt="Аватар"
            src={value}
            sx={{ width: 40, height: 40 }}
          />
        );
      case 'included':
        return columns[key].parse(value);
      case 'dateTime':
        return new Intl.DateTimeFormat('ru-RU', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date(value));
      case 'custom':
        return columns[key].render(value);
      default:
        return value?.toString() || 'Нет данных';
    }
  };

  const renderActions = (actions, idx) => Object.entries(actions)
    .map(([, { icon, tooltip, action, customRender }]) => customRender ? customRender(rows[idx], router, refetch, forceLoading) : (
      <Tooltip key={`${action}${idx}`} title={tooltip}>
        <IconButton onClick={() => action(rows[idx], router, refetch, forceLoading)}>
          { icon }
        </IconButton>
      </Tooltip>
    ));

  const renderPageActions = actions => Object.entries(actions)
    .map(([, { icon, title, action, disabled, customRender }]) => customRender ? customRender(rows, router, refetch, forceLoading) : (
      <Button
        key={`pageaction${action}`}
        startIcon={icon}
        variant="outlined"
        style={{ marginTop: '1em', marginLeft: '1em' }}
        onClick={() => action(rows, router, refetch, forceLoading)}
        disabled={disabled}
      >
        {title}
      </Button>
    ));

  const totallyPages = (qty === -1 || total === 0)
    ? 1
    : Math.ceil(total/qty);

  const TablePaginationActions = (page, totallyPages, onPageChange) => {
    const theme = useTheme();
  
    const handleFirstPageButtonClick = () => {
      onPageChange(1);
    };
  
    const handleBackButtonClick = () => {
      onPageChange(page - 1);
    };
  
    const handleNextButtonClick = () => {
      onPageChange(page + 1);
    };
  
    const handleLastPageButtonClick = () => {
      onPageChange(totallyPages);
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 1}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 1}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page === totallyPages}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page === totallyPages}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  return (
    <>
      {
        !noSearch && (
          <Autocomplete
            freeSolo
            id={searchInputId}
            options={[]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Поиск..."
                onChange={handleChangeSearch}
                className={classNames?.autocompleteTextField}
              />
            )}
            className={classNames?.autocomplete}
            style={searchStyle}
          />
        )
      }
      {
        filters && (
          <Form {...filters} onChangeCallback={values => {
            if (filters.onChangeCallback) {
              filters.onChangeCallback(values);
            }

            setPage(1);
          }} />
        )
      }
      <TableContainer component={Paper}>
        <Button
          variant="contained"
          style={{ marginTop: '1em', marginBottom: '1em', marginRight: '1em' }}
          onClick={customAddButton || (() => router.push(`${url}/create`))}
        >
          Добавить
        </Button>
        { total !== undefined ? <Chip label={`Всего результатов: ${total}`} /> : null}
        { tableChips && data ? tableChips.map(({ label, color }, idx) => <Chip key={`customchip${idx}`} label={label(data)} color={color} />) : null }
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {
                Object.values(columns).map(({ name }) => (
                  <TableCell key={name}>{name}</TableCell>
                ))
              }
              {
                actions
                  ? (
                    <TableCell key="actions-header">Действия</TableCell>
                  )
                  : null
              }
            </TableRow>
          </TableHead>
          <TableBody className={loading ? 'table-rows dimmed' : 'table-rows'}>
            { loading ? <CircularProgress className="loading-spinner" /> : null }
            {rows.map((row, idx) => (
              <>
                {
                  chips ? Object.values(chips).filter(({ show }) => show(row)).map(({ label, color }) => (
                    <Chip key={`chip${idx}${label}`} label={label} style={{ backgroundColor: color }} />
                  )) : null
                }
                <TableRow key={idx}>
                  {
                    Object.entries(row).filter(filterHiddenFields).sort(sortColumns).map(([key, value]) => (
                      <TableCell key={`${idx}${key}${value}`} scope="row">
                        {renderCellContend(key, value)}
                      </TableCell>
                    ))
                  }
                  {
                    actions
                      ? (
                        <TableCell key={`${idx}-actions`} scope="row">
                          {renderActions(actions, idx)}
                        </TableCell>
                      )
                      : null
                  }
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: 'Все', value: -1 }]}
          colSpan={3}
          count={-1}
          rowsPerPage={qty}
          page={page}
          style={{ float: 'right' }}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            label: 'Результатов на странице',
            native: true,
          }}
          labelRowsPerPage={'Результатов на странице'}
          labelDisplayedRows={() => `${page}-${totallyPages}`}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={() => TablePaginationActions(page, totallyPages, handleChangePage)}
        />
      </TableContainer>
      <Button
        variant="contained"
        style={{ marginTop: '1em' }}
        onClick={customAddButton || (() => router.push(`${url}/create`))}
      >
        Добавить
      </Button>
      {
        rows.length && pageActions ? (
          renderPageActions(pageActions)
        ) : null
      }
    </>
  )
};

export default PaginatedTable;
