import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const Office = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Кабинет');
  }, []);

  return <></>
};

export default Office;
