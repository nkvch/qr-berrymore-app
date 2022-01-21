import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const Products = props => {
  const { updateAddTitle } = useContext(Context);

  useEffect(() => {
    updateAddTitle('Продукты');
  }, []);

  return <></>
};

export default Products;
