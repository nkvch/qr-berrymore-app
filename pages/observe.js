import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const Observe = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Статистика');
  }, []);

  return <></>
};

export default Observe;
