import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/Notifications';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';

const fieldsData = {
  productName: {
    label: 'Name of the product',
    type: 'text',
  },
  productPrice: {
    label: 'Price of the product',
    type: 'number',
  },
  photo: {
    label: 'Choose or drop photo here',
    type: 'file',
  },
};

const CreateProduct = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    updateSubTitle('New product');
  }, []);

  const onSubmit = values => {
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );

    request({
      url: '/products',
      method: 'POST',
      body: formData,
      withFiles: true,
      callback: (status, response) => {
        if (status === 'ok') {
          const { productName } = response.data;

          notification.open({
            type: 'success',
            title: `Product ${productName} was successfully added`,
          });

          router.back();
        } else {
          const { message } = response;

          notification.open({
            type: 'error',
            title: `Error: ${message}`,
          });
        }
      },
    });
  }

  return (
    <div className="block">
      <Form
        onSubmit={onSubmit}
        submitText="Save"
        fieldsData={fieldsData}
        className="wide"
      />
    </div>
  )
};

export default CreateProduct;
