import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const columns = {
  id: {
    name: 'ID',
    type: 'number',
  },
  firstName: {
    name: 'Имя',
    type: 'text',
  },
  lastName: {
    name: 'Фамилия',
    type: 'text',
  },
  photoPath: {
    name: 'Фото',
    type: 'image',
  },
};

const Employees = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Сотрудники');
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
