import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import FetchSelect from '../frontendWrapper/components/FetchSelect';

const columns = {
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

const AddPortion = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Новый сбор');
  }, []);

  return (
    <FetchSelect
      url="/employees"
      columns={columns}
    />
  )
};

export default AddPortion;
