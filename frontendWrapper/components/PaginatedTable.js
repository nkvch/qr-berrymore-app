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


const PaginatedTable = props => {
  const { url, columnNames } = props;
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [qty, setQty] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState([]);
  const debouncer = useRef(new Debouncer(500));

  useEffect(() => {
    setLoading(true);

    request({
      url,
      searchParams: {
        page,
        qty,
        search,
        searchColumns: Object.keys(columnNames),
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

  const totallyPages = Math.ceil(total/qty);

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
                Object.values(columnNames).map(columnName => (
                  <TableCell key={columnName}>{columnName}</TableCell>
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
                      {value}
                    </TableCell>
                  ))
                }
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'Все', value: -1 }]}
                colSpan={3}
                count={-1}
                rowsPerPage={qty}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  label: 'Результатов на странице',
                  native: true,
                }}
                labelDisplayedRows={() => `${page}-${totallyPages}`}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={() => TablePaginationActions(page, totallyPages, handleChangePage)}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Link href={`${url}/create`}>
        <Button
          variant="contained"
          style={{ marginTop: '1em' }}
        >
          Добавить
        </Button>
      </Link>
    </>
  )
};

export default PaginatedTable;
