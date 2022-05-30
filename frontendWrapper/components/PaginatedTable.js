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
} from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';
import {
  LastPage as LastPageIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft, 
  KeyboardArrowRight,
} from '@mui/icons-material';
import { notification } from './notifications';
import { useState, useEffect, useRef } from 'react';
import Debouncer from '../utils/debouncer';
import { useRouter } from 'next/router';
import useApi from '../utils/hooks/useApi';

const debouncer = new Debouncer(500);

const PaginatedTable = props => {
  const { url, columns, actions, noSearch, customFilters, customAddButton } = props;

  const [page, setPage] = useState(1);
  const [qty, setQty] = useState(10);
  const [search, setSearch] = useState('');

  const router = useRouter();

  const searchTextColumns = Object.entries(columns)
    .filter(([, { type }]) => type === 'text')
    .map(([key]) => key);

  const searchNumberColumns = Object.entries(columns)
    .filter(([, { type }]) => type === 'number')
    .map(([key]) => key);

  const selectColumns = Object.keys(columns);

  const { loading, data, fetchError, refetch, forceLoading } = useApi({ url }, {
    page,
    qty,
    search,
    searchTextColumns,
    searchNumberColumns,
    selectColumns,
    ...(customFilters),
  });

  const rows = data?.pageData || [];
  const total = data?.total;

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
    setQty(Number(event.target.value));
    setPage(1);
  };

  const handleChangeSearch = event => {
    const { value } = event.target;

    debouncer.debounce(() => {
      setSearch(value);
      setPage(1);
    });

    const [clearBtn] = document.getElementsByClassName('MuiAutocomplete-clearIndicator');
    clearBtn?.addEventListener('click', clearSearch);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const filterHiddenFields = ([key]) => columns[key].type !== 'hidden';

  const filterHiddenHeaders = ({ type }) => type !== 'hidden';

  const renderCellContend = (key, value) => {
    switch (columns[key].type) {
      case 'image':
        return (
          <Avatar
            alt="Аватар"
            src={value}
            sx={{ width: 80, height: 80 }}
          />
        );
      case 'object':
        return columns[key].parse(value);
      case 'dateTime':
        return new Intl.DateTimeFormat('ru-RU', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: 'GMT',
        }).format(new Date(value));
      default:
        return value;
    }
  };

  const renderActions = (actions, idx) => Object.entries(actions)
    .map(([, { icon, tooltip, action }]) => (
      <Tooltip key={`${action}${idx}`} title={tooltip}>
        <IconButton onClick={() => action(rows[idx], router, refetch, forceLoading)}>
          { icon }
        </IconButton>
      </Tooltip>
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
            id={`${url.split('/').pop()}-search`}
            options={[]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Поиск..."
                onChange={handleChangeSearch}
              />
            )}
          />
        )
      }
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {
                Object.values(columns).filter(filterHiddenHeaders).map(({ name }) => (
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
              <TableRow
                key={idx}
                // className={actions?.edit ? 'table-row-hoverable' : ''}
                // onClick={actions?.edit ? () => actions.edit.action(row) : null}
              >
                {
                  Object.entries(row).filter(filterHiddenFields).map(([key, value]) => (
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
    </>
  )
};

export default PaginatedTable;
