import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  IconButton,
  Paper,
  CircularProgress,
  Autocomplete,
  TextField,
  Button,
} from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';
import {
  LastPage as LastPageIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft, 
  KeyboardArrowRight,
} from '@mui/icons-material';
import Link from 'next/link';
import { notification } from './notifications';
import { useState, useEffect, useRef } from 'react';
import request from '../utils/request';
import Debouncer from '../utils/debouncer';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';

const PaginatedTable = props => {
  const { url, columns } = props;
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [qty, setQty] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState([]);
  const debouncer = useRef(new Debouncer(500));
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    const searchColumns = Object.entries(columns)
      .filter(([, { type }]) => type === (Number(search) ? 'number' : 'text'))
      .map(([key]) => key);

    const searchNumbers = !!Number(search);

    request({
      url,
      searchParams: {
        page,
        qty,
        search,
        searchColumns,
        searchNumbers,
      },
      callback: (status, response) => {
        if (status === 'ok') {
          const { data } = response;

          setRows(data.pageData);
          setTotal(data.total);
          setLoading(false);

          if (data.total === 0) {
            notification.open({
              type: 'warning',
              title: 'Результатов не найдено',
            });
          }
        } else {
          notification.open({
            type: 'error',
            title: `Ошибка: ${response.message}`,
          });
        }
      }
    });
  }, [page, qty, search]);

  const handleChangePage = page => {
    setPage(page);
  };

  const handleChangeRowsPerPage = event => {
    setQty(Number(event.target.value));
    setPage(1);
  };

  const handleChangeSearch = event => {
    const { value } = event.target;
    const { debounce } = debouncer.current;

    debounce(() => {
      setSearch(value);
      setPage(1);
    });

    // the only way to handle clear button :(
    const [clearBtn] = document.getElementsByClassName('MuiAutocomplete-clearIndicator');
    clearBtn?.addEventListener('click', clearSearch);
  }

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  }

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
      default:
        return value;
    }
  };

  const totallyPages = qty === -1
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {
                Object.values(columns).map(({ name }) => (
                  <TableCell key={name}>{name}</TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody className={loading ? 'table-rows dimmed' : 'table-rows'}>
            { loading ? <CircularProgress className="loading-spinner" /> : null }
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                {
                  Object.entries(row).map(([key, value]) => (
                    <TableCell key={`${idx}${key}${value}`} scope="row">
                      {renderCellContend(key, value)}
                    </TableCell>
                  ))
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
        onClick={() => router.push(`${url}/create`)}
      >
        Добавить
      </Button>
    </>
  )
};

export default PaginatedTable;
