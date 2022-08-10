import Context from '../frontendWrapper/context'; 
import { useContext, useEffect, useState } from 'react';
import useApi from '../frontendWrapper/utils/hooks/useApi';
import PaginatedTable from '../frontendWrapper/components/PaginatedTable';
import { ModeEdit, Delete, PriceCheck, ManageSearch, BarChart, TableRows, CleaningServices } from '@mui/icons-material';
import {
  VictoryPie as Pie,
  VictoryLegend as Legend,
  VictoryLine as Line,
  VictoryChart as Chart,
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryTheme,
  VictoryTooltip,
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

const employeeFlags = [
  { value: 'isWorking', text: 'Working', color: '#fc7303' },
  { value: 'printedQR', text: 'QR printed', color: '#03a5fc' },
  { value: 'blacklisted', text: 'Blacklisted', color: '#808080' },
  { value: 'goodWorker', text: 'Good worker', color: '#1e9e05' },
  { value: 'workedBefore', text: 'Worked before', color: '#d9c045' },
  { value: 'called', text: 'Called', color: '#c75fed' },
];

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

const foremanColumns = {
  id: {
    name: 'id',
    type: 'number',
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

const columns = {
  id: {
    name: 'ID',
    type: 'number',
  },
  amount: {
    name: 'Amount (kg)',
    type: 'number',
  },
  dateTime: {
    name: 'Date and time',
    type: 'dateTime',
  },
  employee: {
    name: 'Employee',
    type: 'included',
    parse: emp => emp ? `${emp.firstName} ${emp.lastName}` : 'No data',
  },
  product: {
    name: 'Product',
    type: 'included',
    parse: prod => prod?.productName || 'No data',
  },
};

const hiddenButRequiredData = ['employeeId', 'productId'];

const summarizeCols = {
  employee: {
    name: 'Employee',
    type: 'included',
    parse: emp => emp ? `${emp.firstName} ${emp.lastName}` : 'No data',
  },
  allAmount: {
    name: 'All amount',
    type: 'custom',
    render: num => `${num.toFixed(2)} kg`,
  },
  allPrice: {
    name: 'All price',
    type: 'custom',
    render: num => parsePrice(num),
  },
};

const actions = {
  delete: {
    icon: <Delete />,
    tooltip: 'Delete',
    action: (rec, _, refetch, forceLoading) => {
      const dialogKey = notification.open({
        type: 'warning',
        title: 'Deleting record from history',
        text: `Are you sure you want to record ${rec.id} ${rec.employee?.firstName || ''} ${rec.employee?.lastName || ''} ${rec.product?.productName || ''} ${rec.amount}?`,
        actions: [{
          title: 'Delete',
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
                    title: 'Record was deleted successfullyа',
                  });
                  refetch();
                } else {
                  notification.open({
                    type: 'error',
                    title: 'Error while deleting record',
                    text: response.message,
                  });
                };
              },
            });
          },
        }, {
          title: 'Cancel',
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
  };

  const [tableMode, setTableMode] = useState(false);
  const [filters, setFilters] = useState(initFilters);

  useEffect(() => {
    updateSubTitle('Statistics');
  }, []);

  const filtersConfig = {
    fieldsData: {
      employee: {
        label: 'Choose employee',
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
      product: {
        label: 'Choose product',
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
        label: 'Choose foreman',
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
        label: 'Filter by flag presence',
        type: 'multiple-select',
        defaultValue: [],
        multipleSelectConfig: {
          multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
        },
        style: { width: '18%', display: 'inline-block' },
      },
      sortFilters: {
        label: 'Sort',
        type: 'select',
        selectConfig: {
          options: summarize ? [
            { value: 'employee.lastName asc', text: 'By last name' },
            { value: 'allAmount desc', text: 'From the most' },
            { value: 'allAmount asc', text: 'From the least' },
          ] : [
            { value: 'history.dateTime desc', text: 'From latest' },
            { value: 'history.dateTIme asc', text: 'From oldest' }
          ],
        },
        defaultValue: defaultSort,
        style: { width: '11%' },
      },
      fromDateTime: {
        label: 'From',
        type: 'datetime',
        style: { width: '12%' },
      },
      toDateTime: {
        label: 'To',
        type: 'datetime',
        style: { width: '12%' },
      },
    },
  };

  const onChangeFilters = values => {
    const { fromDateTime, toDateTime, sortFilters, flagsPresent, ...restFilters } = values;

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
    });
  };

  const pageActions = {
    summarize: {
      icon: summarize ? <ManageSearch /> : <PriceCheck />,
      title: summarize ? 'Back to history' : 'Summarize',
      action: () => {
        const newSummarize = !summarize;

        setFilters(({ sortColumn, ...rest }) => ({
          ...rest,
          sortColumn: newSummarize ? 'allAmount' : 'history.dateTime',
          sorting: 'desc',
        }));

        if (!newSummarize) {
          setTableMode(true);
        }

        setSummarize(newSummarize);
      },
    },
    ...(summarize && {
      switchMode: {
        icon: tableMode ? <BarChart /> : <TableRows />,
        title: tableMode ? 'To chart mode' : 'To table mode',
        action: () => setTableMode(prev => !prev),
      },
    }),
  };

  const filtersFormConfig = {
    ...filtersConfig,
    submitable: false,
    className: "row-form",
    intable: true,
    resetText: "Clear",
    resetStyle: { width: '10%' },
    resetFilters: () => setFilters(initFilters),
    onChangeCallback: onChangeFilters,
  };

  const tableChips = [{
    label: data => data?.totalAmount ? `Total ${data.totalAmount.allAmount.toFixed(2)} kg or ${parsePrice(data.totalAmount.allPrice)}` : '',
    color: 'success',
  }];

  const renderCharts = (rows, qty, page, setQty, setPage) => {
    if (qty !== 10) {
      setQty(10);
    }

    const tickValues = rows.map((item, idx) => idx);
    const tickFormat = rows.map(({ employee: { firstName, lastName } }) => `${firstName} ${lastName}`);

    return (
      <div>
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{ x: [0, 10], y: [0, Math.max(...rows.map(({ allAmount }) => allAmount))] }}
          width={700}
        >
          <VictoryAxis
            tickValues={tickValues}
            tickFormat={tickFormat}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={x => `${x} kg`}
          />
          <VictoryBar
            data={rows}
            labels={({ datum: { allAmount, allPrice }}) => `Amount: ${allAmount.toFixed(2)} kg.\nPrice: ${parsePrice(allPrice)}`}
            y="allAmount"
            labelComponent={<VictoryTooltip dy={0} centerOffset={{ x: 25 }} />}
          />
        </VictoryChart>
      </div>
    );
  };

  return (
    <div className="block">
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
        customDataRender={tableMode ? null : renderCharts}
      />
    </div>
  )
};

export default Stats;
