import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';

const columnNames = {
  id: 'ID',
  firstName: 'Имя',
  lastName: 'Фамилия',
  photo_path: 'Фото',
};

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
