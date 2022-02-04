import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const columns = {
  id: {
    name: 'ID',
    type: 'number',
  },
  productName: {
    name: 'Продукт',
    type: 'text',
  },
  productPrice: {
    name: 'Цена',
    type: 'number',
  },
  photoPath: {
    name: 'Фото',
    type: 'image',
  },
};

const Products = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Продукты');
  }, []);

  return (
    <div className="block">
      <PaginatedTable
        url="/products"
        columns={columns}
      />
    </div>
  )
};

export default Products;
