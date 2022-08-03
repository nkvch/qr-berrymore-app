import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import Form from '../frontendWrapper/components/Form';
import request from '../frontendWrapper/utils/request';
import { notification } from '../frontendWrapper/components/Notifications';
import router from 'next/router';

const employeeColumns = {
  id: {
    name: 'id',
    type: 'number',
  },
  photoPath: {
    name: 'Photo',
    type: 'image',
  },
  firstName: {
    name: 'First Name',
    type: 'text',
  },
  lastName: {
    name: 'Last Name',
    type: 'text',
  },
};

const productColumns = {
  id: {
    name: 'id',
    type: 'number',
  },
  photoPath: {
    name: 'Photo',
    type: 'image',
  },
  productName: {
    name: 'First Name',
    type: 'text',
  },
};

const fieldsData = {
  employeeId: {
    label: 'Choose employee',
    type: 'fetch-select',
    fetchSelectConfig: {
      url: '/employees',
      columns: employeeColumns,
      showInOption: ['photoPath', 'firstName', 'lastName'],
      showInValue: ['firstName', 'lastName'],
      returnValue: 'id',
    }
  },
  productId: {
    label: 'Choose product',
    type: 'fetch-select',
    fetchSelectConfig: {
      url: '/products',
      columns: productColumns,
      showInOption: ['photoPath', 'productName'],
      showInValue: ['productName'],
      returnValue: 'id',
    }
  },
  amount: {
    label: 'Amount of the product (kg)',
    type: 'number',
  },
  dateTime: {
    label: 'Date and time',
    type: 'datetime',
    defaultValue: new Date(),
  }
};

const AddPortion = props => {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('New portion');
  }, []);

  const handleSubmit = values => {
    values.dateTime = values.dateTime?.toISOString();

    request({
      url: '/history',
      method: 'POST',
      body: values,
      callback: (status, response) => {
        if (status === 'ok') {
          notification.open({
            type: 'success',
            title: 'Successfully saved record',
          });
          router.push('/stats');
        } else if (status === 'error') {
          notification.open({
            type: status,
            title: response.message,
          });
        }
      }
    });
  }

  return (
    <div className="block">
      <Form
        onSubmit={handleSubmit}
        submitText="Save"
        fieldsData={fieldsData}
        className="wide"
      />
    </div>
  )
};

export default AddPortion;
