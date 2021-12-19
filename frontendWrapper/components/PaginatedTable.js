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
} from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';
import {
  LastPage as LastPageIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft, 
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useRouter } from 'next/dist/client/router';
import { useState, useEffect } from 'react';
import request from '../utils/request';


const PaginatedTable = props => {
  const { url, columnNames } = props;
  const [page, setPage] = useState(1);
  const [qty, setQty] = useState(10);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    request({
      url,
      searchParams: {
        page,
        qty,
      },
      callback: (status, response) => {
        if (status === 'ok') {
          const { data } = response;

          setRows(data.pageData);
          setTotal(data.total);
        } else {
          //
        }
      }
    });
  }, [page, qty]);

  const handleChangePage = page => {
    setPage(page);
  };

  const handleChangeRowsPerPage = event => {
    setQty(Number(event.target.value));
  };

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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            {
              columnNames.map(columnName => (
                <TableCell key={columnName}>{columnName}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
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
  )
};

export default PaginatedTable;
