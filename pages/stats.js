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
import { notification } from '../frontendWrapper/components/notifications';
import request from '../frontendWrapper/utils/request';
import FetchSelect from '../frontendWrapper/components/FetchSelect';
import styles from '../styles/Form.module.scss';
import { useRouter } from 'next/router';
import getLocalDateTimeString from '../frontendWrapper/utils/getLocalDateTimeString';
import Form from '../frontendWrapper/components/Form';
import parsePrice from '../frontendWrapper/utils/parsePrice';
import getStartOfToday from '../frontendWrapper/utils/getStartOfToday';

const url = '/history';

const employeeFlags = [
  { value: 'isWorking', text: 'Работает', color: '#fc7303' },
  { value: 'printedQR', text: 'QR распечатан', color: '#03a5fc' },
  { value: 'blacklisted', text: 'Черный список', color: '#808080' },
  { value: 'goodWorker', text: 'Хороший работник', color: '#1e9e05' },
  { value: 'workedBefore', text: 'Работал прежде', color: '#d9c045' },
  { value: 'called', text: 'Звонили', color: '#c75fed' },
];

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
    parse: emp => emp ? `${emp.lastName} ${emp.firstName} ` : 'Нет данных',
  },
  product: {
    name: 'Продукт',
    type: 'included',
    parse: prod => prod?.productName || 'Нет данных',
  },
};

const hiddenButRequiredData = ['employeeId', 'productId'];

const summarizeCols = {
  employee: {
    name: 'Сотрудник',
    type: 'included',
    parse: emp => emp ? `${emp.lastName} ${emp.firstName}` : 'Нет данных',
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

const Stats = props => {
  const { updateSubTitle } = useContext(Context);

  const router = useRouter();

  const [summarize, setSummarize] = useState(true);

  const defaultSort = summarize ? 'allAmount desc' : 'history.dateTime desc';

  const [defaultSortColumn, defaultSorting] = defaultSort.split(' ');

  const initFilters = {
    sortColumn: defaultSortColumn,
    sorting: defaultSorting,
    fromDateTime: getStartOfToday().toISOString(),
  };

  const [tableMode, setTableMode] = useState(true);
  const [filters, setFilters] = useState(initFilters);

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
        style: { width: '12%' },
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
        style: { width: '12%' },
      },
      flagsPresent: {
        label: 'Фильтровать по наличию флага',
        type: 'multiple-select',
        defaultValue: [],
        multipleSelectConfig: {
          multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
        },
        style: { width: '18%', display: 'inline-block' },
      },
      flagsAbsent: {
        label: 'Фильтровать по отсутствию флага',
        type: 'multiple-select',
        defaultValue: [],
        multipleSelectConfig: {
          multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
        },
        style: { width: '18%', display: 'inline-block' },
      },
      sortFilters: {
        label: 'Сортировать',
        type: 'select',
        selectConfig: {
          options: summarize ? [
            { value: 'employee.lastName asc', text: 'По алфавиту' },
            { value: 'allAmount desc', text: 'От самого большого' },
            { value: 'allAmount asc', text: 'От самого маленького' },
          ] : [
            { value: 'history.dateTime desc', text: 'От недавнего' },
            { value: 'history.dateTIme asc', text: 'От давнего' }
          ],
        },
        defaultValue: defaultSort,
        style: { width: '11%' },
      },
      fromDateTime: {
        label: 'От',
        type: 'datetime',
        defaultValue: getStartOfToday(),
        style: { width: '12%' },
      },
      toDateTime: {
        label: 'До',
        type: 'datetime',
        style: { width: '12%' },
      },
    },
  };

  const onChangeFilters = values => {
    const { fromDateTime, toDateTime, sortFilters, flagsPresent, flagsAbsent, ...restFilters } = values;

    if (flagsPresent.some(flag => flagsAbsent.includes(flag))) {
      notification.open({
        type: 'warning',
        title: 'Ошибка в фильтрах',
        text: 'Один и тот же флаг не может присутствовать и отсутствовать одновременно. Результаты могут быть неправильными.'
      });
    }

    const [sortColumn, sorting] = sortFilters?.split(' ') || [];

    setFilters({
      ...Object.fromEntries(Object.entries({ ...restFilters, sortColumn, sorting }).filter(([_, val]) => val !== undefined)),

      ...(fromDateTime && {
        fromDateTime: fromDateTime.toISOString(),
      }),

      ...(toDateTime && {
        toDateTime: toDateTime.toISOString(),
      }),

      ...(Object.fromEntries(flagsPresent.map(flag => ([flag, true])))),
      ...(Object.fromEntries(flagsAbsent.map(flag => ([flag, false])))),
    });
  };

  const pageActions = {
    summarize: {
      icon: summarize ? <ManageSearch /> : <PriceCheck />,
      title: summarize ? 'История' : 'Рассчитать',
      action: () => {
        const newSummarize = !summarize;

        setFilters(({ sortColumn, ...rest }) => ({
          ...rest,
          sortColumn: newSummarize ? 'allAmount' : 'history.dateTime',
          sorting: 'desc',
        }));

        setSummarize(newSummarize);
      },
    },
  };

  const filtersFormConfig = {
    ...filtersConfig,
    submitable: false,
    className: "row-form",
    intable: true,
    resetText: "Сбросить",
    resetStyle: { width: '6%' },
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
            hiddenButRequiredData={hiddenButRequiredData}
          />
        ) : null
      }
    </div>
  )
};

export default Stats;
