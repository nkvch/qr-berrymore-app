import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const Office = props => {
  const { updateAddTitle } = useContext(Context);

  useEffect(() => {
    updateAddTitle('Кабинет');
  }, []);

  return <></>
};

export default Office;
