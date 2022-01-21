import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const Observe = props => {
  const { updateAddTitle } = useContext(Context);

  useEffect(() => {
    updateAddTitle('Статистика');
  }, []);

  return <></>
};

export default Observe;
