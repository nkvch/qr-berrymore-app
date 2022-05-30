import { useRouter } from 'next/router';
import useApi from '../../frontendWrapper/utils/hooks/useApi';
import { notification } from '../../frontendWrapper/components/notifications';
import { useEffect, useContext } from 'react';
import { CircularProgress } from '@mui/material';
import Context from '../../frontendWrapper/context';
import Form from '../../frontendWrapper/components/Form';
import request from '../../frontendWrapper/utils/request';

const url = '/products';

const getFieldsData = productData => ({
  productName: {
    label: 'Название продукта',
    type: 'text',
    defaultValue: productData?.productName,
  },
  productPrice: {
    label: 'Цена продукта',
    type: 'number',
    defaultValue: productData?.productPrice,
  },
  photo: {
    label: 'Выберите или перетащите сюда фотографию',
    type: 'file',
    defaultValue: productData?.photoPath,
  },
});

const EditProduct = props => {
  const { updateSubTitle } = useContext(Context);
  const router = useRouter();
  const { id } = router.query;

  const disableFetching = !id;

  const { loading, data, fetchError } = useApi({
    url: `${url}/${id}`,
  }, {}, disableFetching);

  useEffect(() => {
    updateSubTitle('Редактирование продукта');
  }, []);

  useEffect(() => {
    if (fetchError) {
      notification.open({
        type: 'error',
        title: `Ошибка: ${fetchError}`,
      });
    }
  }, [fetchError]);

  const onSubmit = values => {
    const withNewPhoto = values.photo instanceof File;
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );

    if (!withNewPhoto) {
      formData.delete('photo');
    }

    request({
      url: `${url}/${id}`,
      method: 'PUT',
      body: formData,
      withFiles: true,
      callback: (status, response) => {
        if (status === 'ok') {
          const { productName } = response.data;

          notification.open({
            type: 'success',
            title: `Данные о продукте ${productName} успешно обновлены`,
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
  };

  return <div className="block">
    {
      loading
        ? <CircularProgress className="loading-spinner" />
        : (
          <Form
            onSubmit={onSubmit}
            submitText="Сохранить"
            fieldsData={getFieldsData(data)}
            className="wide"
          />
        )
    }
    </div>
};

export default EditProduct;
