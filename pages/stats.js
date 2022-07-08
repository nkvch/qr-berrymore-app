import Context from '../frontendWrapper/context'; 
import { useContext, useEffect, useState } from 'react';
import useApi from '../frontendWrapper/utils/hooks/useApi';
import PaginatedTable from '../frontendWrapper/components/PaginatedTable';
import { ModeEdit, Delete, PriceCheck, ManageSearch } from '@mui/icons-material';
import {
  VictoryPie as Pie,
  VictoryLegend as Legend,
  VictoryLine as Line,
  VictoryChart as Chart,
} from 'victory';
import { Switch, FormControlLabel, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { notification } from '../frontendWrapper/components/Notifications';
import request from '../frontendWrapper/utils/request';
import FetchSelect from '../frontendWrapper/components/FetchSelect';
import styles from '../styles/Form.module.scss';
import { useRouter } from 'next/router';
import getLocalDateTimeString from '../frontendWrapper/utils/getLocalDateTimeString';
import Form from '../frontendWrapper/components/Form';
import parsePrice from '../frontendWrapper/utils/parsePrice';

const url = '/history';

const employeeColumns = {
  id: {
    name: 'id',
    type: 'number',
  },
  photoPath: {
    name: 'Фото',
    type: 'image',
  },
  firstName: {
    name: 'Имя',
    type: 'text',
  },
  lastName: {
    name: 'Фамилия',
    type: 'text',
  },
};

const productColumns = {
  id: {
    name: 'id',
    type: 'number',
  },
  photoPath: {
    name: 'Фото',
    type: 'image',
  },
  productName: {
    name: 'Имя',
    type: 'text',
  },
};

const foremanColumns = {
  id: {
    name: 'id',
    type: 'number',
  },
  firstName: {
    name: 'Имя',
    type: 'text',
  },
  lastName: {
    name: 'Фамилия',
    type: 'text',
  },
};

const columns = {
  id: {
    name: 'ID',
    type: 'number',
  },
  employeeId: {
    type: 'number',
    hidden: true,
  },
  productId: {
    type: 'number',
    hidden: true,
  },
  amount: {
    name: 'Количество (кг)',
    type: 'number',
  },
  dateTime: {
    name: 'Дата и время',
    type: 'dateTime',
  },
  employee: {
    name: 'Сотрудник',
    type: 'included',
    parse: emp => emp ? `${emp.firstName} ${emp.lastName}` : 'Нет данных',
  },
  product: {
    name: 'Продукт',
    type: 'included',
    parse: prod => prod?.productName || 'Нет данных',
  },
};

const summarizeCols = {
  employeeId: {
    type: 'number',
    hidden: true,
  },
  allAmount: {
    name: 'Все количество',
    type: 'custom',
    render: num => `${num.toFixed(2)} кг`,
  },
  allPrice: {
    name: 'Вся сумма',
    type: 'custom',
    render: num => parsePrice(num),
  },
  employee: {
    name: 'Сотрудник',
    type: 'included',
    parse: emp => emp ? `${emp.firstName} ${emp.lastName}` : 'Нет данных',
  },
};

const actions = {
  delete: {
    icon: <Delete />,
    tooltip: 'Удалить',
    action: (rec, _, refetch, forceLoading) => {
      const dialogKey = notification.open({
        type: 'warning',
        title: 'Удаление записи из истории',
        text: `Вы действительно хотите запись ${rec.id} ${rec.employee?.firstName || ''} ${rec.employee?.lastName || ''} ${rec.product?.productName || ''} ${rec.amount}?`,
        actions: [{
          title: 'Удалить',
          action: () => {
            notification.close(dialogKey);

            forceLoading(true);

            request({
              url: `/history/${rec.id}`,
              method: 'DELETE',
              callback: (status, response) => {
                if (status === 'ok') {
                  notification.open({
                    type: 'success',
                    title: 'Запись успешно удалена',
                  });
                  refetch();
                } else {
                  notification.open({
                    type: 'error',
                    title: 'Ошибка при удалении записи',
                    text: response.message,
                  });
                };
              },
            });
          },
        }, {
          title: 'Отменить',
          action: () => notification.close(dialogKey),
        }],
      });
      window.scrollTo(0, 0);
    },
  },
};

const initFilters = {
  sortColumn: 'dateTime',
  sorting: 'desc',
};

const Stats = props => {
  const { updateSubTitle } = useContext(Context);

  const router = useRouter();

  const [tableMode, setTableMode] = useState(true);
  const [filters, setFilters] = useState(initFilters);
  const [summarize, setSummarize] = useState(false);

  useEffect(() => {
    updateSubTitle('Статистика');
  }, []);

  const filtersConfig = {
    fieldsData: {
      employee: {
        label: 'Выберите сотрудника',
        type: 'fetch-select',
        fetchSelectConfig: {
          url: '/employees',
          columns: employeeColumns,
          showInOption: ['photoPath', 'firstName', 'lastName'],
          showInValue: ['firstName', 'lastName'],
          returnValue: 'id',
        },
        style: { width: '15%' },
      },
      product: {
        label: 'Выберите продукт',
        type: 'fetch-select',
        fetchSelectConfig: {
          url: '/products',
          columns: productColumns,
          showInOption: ['photoPath', 'productName'],
          showInValue: ['productName'],
          returnValue: 'id',
        },
        style: { width: '15%' },
      },
      foreman: {
        label: 'Выберите бригадира',
        type: 'fetch-select',
        fetchSelectConfig: {
          url: '/foremen',
          columns: foremanColumns,
          showInOption: ['firstName', 'lastName'],
          showInValue: ['firstName', 'lastName'],
          returnValue: 'id',
        },
        style: { width: '15%' },
      },
      sortFilters: {
        label: 'Сортировать',
        type: 'select',
        selectConfig: {
          options: [
            { value: 'dateTime desc', text: 'От недавнего' },
            { value: 'dateTIme asc', text: 'От давнего' },
            { value: 'amount desc', text: 'От самого большого' },
            { value: 'amount asc', text: 'От самого маленького' },
          ],
        },
        style: { width: '15%' },
      },
      fromDateTime: {
        label: 'От',
        type: 'datetime',
        style: { width: '15%' },
      },
      toDateTime: {
        label: 'До',
        type: 'datetime',
        style: { width: '15%' },
      },
    },
  };

  const onChangeFilters = values => {
    const { fromDateTime, toDateTime, sortFilters, ...restFilters } = values;

    const [sortColumn, sorting] = sortFilters?.split(' ') || [];

    setFilters({
      ...Object.fromEntries(Object.entries({ ...restFilters, sortColumn, sorting }).filter(([_, val]) => val !== undefined)),

      ...(fromDateTime && {
        fromDateTime: fromDateTime.toISOString(),
      }),

      ...(toDateTime && {
        toDateTime: toDateTime.toISOString(),
      }),
    });
  };

  const pageActions = {
    summarize: {
      icon: summarize ? <ManageSearch /> : <PriceCheck />,
      title: summarize ? 'Вернуться к истории' : 'Рассчитать',
      action: () => setSummarize(prev => !prev),
    },
  };

  const filtersFormConfig = {
    ...filtersConfig,
    submitable: false,
    className: "row-form",
    intable: true,
    resetText: "Сбросить",
    resetStyle: { width: '10%' },
    resetFilters: () => setFilters(initFilters),
    onChangeCallback: onChangeFilters,
  };

  const tableChips = [{
    label: data => data?.totalAmount ? `Итого ${data.totalAmount.allAmount.toFixed(2)} кг или ${parsePrice(data.totalAmount.allPrice)}` : '',
    color: 'success',
  }];

  return (
    <div className="block">
      {
        tableMode ? (
          <PaginatedTable
            url="/history"
            columns={summarize ? summarizeCols : columns}
            actions={summarize ? null : actions}
            noSearch
            filters={filtersFormConfig}
            pageActions={pageActions}
            customFilters={{ ...filters, summarize }}
            tableChips={tableChips}
            customAddButton={() => router.push('/new-portion')}
          />
        ) : null
      }
    </div>
  )
};

export default Stats;
