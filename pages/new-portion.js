import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import FetchSelect from '../frontendWrapper/components/FetchSelect';

const employeeColumns = {
  photoPath: {
    name: 'Фото',
    type: 'image',
  },
  firstName: {
    name: 'Имя',
    type: 'text',
  },
  lastName: {
    name: 'Фамилия',
    type: 'text',
  },
};

const productColumns = {
  photoPath: {
    name: 'Фото',
    type: 'image',
  },
  productName: {
    name: 'Имя',
    type: 'text',
  },
};

const AddPortion = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Новый сбор');
  }, []);

  return (
    <div className="block">
      <FetchSelect
        url="/employees"
        columns={employeeColumns}
        placeholder="Выберите сотрудника"
        renderSelected={selected => `${selected.firstName} ${selected.lastName}`}
      />
      <FetchSelect
        url="/products"
        columns={productColumns}
        placeholder="Выберите продукт"
        renderSelected={selected => selected.productName}
      />
    </div>
  )
};

export default AddPortion;
