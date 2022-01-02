import { Table } from "@mui/material";

const Table = ({ columnNames, rows }) => (
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
  </Table>
</TableContainer>
);

export default Table;
