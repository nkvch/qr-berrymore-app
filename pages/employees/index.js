import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const columns = {
  id: {
    name: 'ID',
    type: 'text',
  },
  firstName: {
    name: 'Имя',
    type: 'text',
  },
  lastName: {
    name: 'Фамилия',
    type: 'text',
  },
  photo_path: {
    name: 'Фото',
    type: 'image',
  },
};

const Employees = props => {
  const { updateAddTitle } = useContext(Context);

  useEffect(() => {
    updateAddTitle('Сотрудники');
  }, []);

  return (
    <div className="block">
      <PaginatedTable
        url="/employees"
        columns={columns}
      />
    </div>
  )
};

export default Employees;
