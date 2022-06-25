import Context from '../frontendWrapper/context'; 
import { useContext, useEffect, useState } from 'react';
import useApi from '../frontendWrapper/utils/hooks/useApi';
import PaginatedTable from '../frontendWrapper/components/PaginatedTable';
import { ModeEdit, Delete } from '@mui/icons-material';
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

const employeeSelectConfig = {
  label: 'Сотрудник',
  url: '/employees',
  columns: employeeColumns,
  showInOption: ['photoPath', 'firstName', 'lastName'],
  showInValue: ['firstName', 'lastName'],
  returnValue: 'id',
};

const productSelectConfig = {
  label: 'Продукт',
  url: '/products',
  columns: productColumns,
  showInOption: ['photoPath', 'productName'],
  showInValue: ['productName'],
  returnValue: 'id',
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

  useEffect(() => {
    updateSubTitle('Статистика');
  }, []);

  const handleSortingChange = e => {
    const [sortColumn, sorting] = e.target.value.split(' ');

    setFilters(prevFilters => ({
      ...prevFilters,
      sortColumn,
      sorting,
    }));
  };

  const handleDateTimeChange = which => e => {
    const value = e.target.value;

    setFilters(prevFilters => ({
      ...prevFilters,
      [`${which}DateTime`]: value ? new Date(value) : null,
    }));
  };

  const handleFetchSelectChange = which => (_, value) => setFilters(prevFilters => ({
    ...prevFilters,
    [which]: value?.id,
  }));

  const getFilters = () => {
    const { fromDateTime, toDateTime, ...restFilters } = filters;

    return {
      ...restFilters,

      ...(fromDateTime && {
        fromDateTime: fromDateTime.toISOString(),
      }),

      ...(toDateTime && {
        toDateTime: toDateTime.toISOString(),
      }),
    }
  };

  return (
    <div className="block">
      {/* <FormControlLabel control={(
        <Switch
          onChange={(_, checked) => setTableMode(checked)}
        />
      )} label="В виде таблицы" /> */}
      <div>
        <FetchSelect
          {...employeeSelectConfig}
          style={{
            display: 'inline-block',
            width: '25%',
          }}
          onChange={handleFetchSelectChange('employee')}
        />
        <FetchSelect
          {...productSelectConfig}
          style={{
            display: 'inline-block',
            width: '25%',
          }}
          onChange={handleFetchSelectChange('product')}
        />
        <TextField
          className={styles['form-field']}
          name="fromDateTime"
          label="От"
          variant="outlined"
          onChange={handleDateTimeChange('from')}
          value={filters.fromDateTime ? getLocalDateTimeString(filters.fromDateTime) : null}
          type="datetime-local"
          InputLabelProps={{
            shrink: true
          }}
          style={{
            display: 'inline-block',
            width: 'fit-content',
          }}
        />
        <TextField
          className={styles['form-field']}
          name="toDateTime"
          label="До"
          variant="outlined"
          onChange={handleDateTimeChange('to')}
          value={filters.toDateTime ? getLocalDateTimeString(filters.toDateTime) : null}
          type="datetime-local"
          InputLabelProps={{
            shrink: true
          }}
          style={{
            display: 'inline-block',
            width: 'fit-content',
          }}
        />
        <FormControl
          style={{
            display: 'inline-block',
          }}
        >
          <InputLabel id="select-history-sorting-label">Сортировать</InputLabel>
          <Select
            labelId="select-history-sorting-label"
            id="select-history-sorting"
            value={`${filters.sortColumn} ${filters.sorting}`}
            label="Сортировать"
            onChange={handleSortingChange}
          >
            <MenuItem value="dateTime desc">От недавнего</MenuItem>
            <MenuItem value="dateTime asc">От давнего</MenuItem>
            <MenuItem value="amount desc">От самого большого</MenuItem>
            <MenuItem value="amount asc">От самого маленького</MenuItem>
          </Select>
        </FormControl>
        {/* <Button
          type="button"
          variant="contained"
          style={{
            display: 'block',
          }}
          onClick={() => setFilters(initFilters)}
        >
          Сбросить фильтры
        </Button> */}
      </div>
      {
        tableMode ? (
          <PaginatedTable
            url="/history"
            columns={columns}
            actions={actions}
            noSearch
            customFilters={getFilters()}
            customAddButton={() => router.push('/new-portion')}
          />
        ) : null
      }
    </div>
  )
};

export default Stats;
