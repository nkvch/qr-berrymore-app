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
    type: 'hidden',
  },
  productId: {
    type: 'hidden',
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
    type: 'object',
    parse: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  },
  product: {
    name: 'Продукт',
    type: 'object',
    parse: ({ productName }) => productName,
  },
};

const actions = {
  delete: {
    icon: <Delete />,
    tooltip: 'Удалить',
    action: (rec, _, refetch) => {
      const dialogKey = notification.open({
        type: 'warning',
        title: 'Удаление записи из истории',
        text: `Вы действительно хотите запись ${rec.id} ${rec.employee.firstName} ${rec.employee.lastName} ${rec.product.productName} ${rec.amount}?`,
        actions: [{
          title: 'Удалить',
          action: () => {
            notification.close(dialogKey);
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


  const [tableMode, setTableMode] = useState(true);
  const [filters, setFilters] = useState(initFilters);

  useEffect(() => {
    updateSubTitle('Статистика');
  }, []);

  const selectColumns = Object.keys(columns);
  const includeEntities = ['employee', 'product'];

  const { loading, data, fetchError } = useApi({ url }, {
    selectColumns,
    includeEntities,
    qty: '-1',
  });

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
      [`${which}DateTime`]: value,
    }));
  };

  const handleFetchSelectChange = which => (_, value) => setFilters(prevFilters => ({
    ...prevFilters,
    [which]: value?.id,
  }));

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
          value={filters.fromDateTime}
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
          value={filters.toDateTime}
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
            customFilters={{
              ...filters,
              ...(filters.fromDateTime && {
                fromDateTime: `${filters.fromDateTime}:00.000Z`,
              }),
              ...(filters.toDateTime && {
                toDateTime: `${filters.toDateTime}:00.000Z`,
              }),
            }}
          />
        ) : null
      }
    </div>
  )
};

export default Stats;
