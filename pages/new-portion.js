import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const AddPortion = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Новый сбор');
  }, []);

  const fieldsData = {
    employeeId: {
      label: 'Сотрудник',
      type: 'select',
    },
    productId: {
      label: 'Продукт',
      type: 'select',
    },
    dateTime: {
      label: 'Дата и время сбора',
      type: 'datetime',
    },
  };

  return <></>
};

export default AddPortion;
