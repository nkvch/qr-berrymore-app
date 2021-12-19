import request from '../frontendWrapper/utils/request';
import PaginatedTable from '../frontendWrapper/components/PaginatedTable';
import { useState, useEffect } from 'react';

const columnNames = [
  'ID',
  'Имя',
  'Фамилия',
  'Фото',
];

const Employees = props => {
  return (
    <div className="block">
      <PaginatedTable
        url="/employees"
        columnNames={columnNames}
      />
    </div>
  )
};

export default Employees;
