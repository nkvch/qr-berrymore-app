import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/Notifications';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/dist/client/router';

const fieldsData = {
  productName: {
    label: 'Название продукта',
    type: 'text',
  },
  productPrice: {
    label: 'Цена продукта',
    type: 'number',
  },
  photo: {
    label: 'Выберите или перетащите сюда фотографию',
    type: 'file',
  },
};

const CreateProduct = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    updateSubTitle('Новый продукт');
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
            title: `Продукт ${productName} успешно добавлен`,
          });

          router.back();
        } else {
          const { message } = response;

          notification.open({
            type: 'error',
            title: `Ошибка: ${message}`,
          });
        }
      },
    });
  }

  return (
    <div className="block">
      <Form
        onSubmit={onSubmit}
        submitText="Сохранить"
        fieldsData={fieldsData}
        className="wide"
      />
    </div>
  )
};

export default CreateProduct;
