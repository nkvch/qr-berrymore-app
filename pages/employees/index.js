import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect, useState } from 'react';
import { QrCode2, ModeEdit, Delete, Work, WorkOff, Print, CancelPresentation, SelectAll } from '@mui/icons-material';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/Notifications';
import { Button, Checkbox, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { QRCodeCanvas } from 'qrcode.react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MultipleQRCodes from '../../frontendWrapper/components/MultipleQRCodes';
import InvisibleQRCodes from '../../frontendWrapper/components/InvisibleQRCodes';
import Form from '../../frontendWrapper/components/Form';

const url = '/employees';

const employeeFlags = [
  { value: 'isWorking', text: 'Работает', color: '#fc7303' },
  { value: 'printedQR', text: 'QR распечатан', color: '#03a5fc' },
  { value: 'blacklisted', text: 'Черный список', color: '#808080' },
  { value: 'goodWorker', text: 'Хороший работник', color: '#1e9e05' },
  { value: 'workedBefore', text: 'Работал прежде', color: '#d9c045' },
  { value: 'wontWork', text: 'Не будет работать', color: '#BF156C' },
];

const columns = {
  contract: {
    name: 'Номер кантракта',
    type: 'text',
  },
  lastName: {
    name: 'Фамилия',
    type: 'text',
  },
  firstName: {
    name: 'Имя',
    type: 'text',
  },
  phone: {
    name: 'Телефон',
    type: 'custom',
    render: number => number ? `+${number}` : 'Нет данных',
  },
  additionalPhone: {
    name: 'Дополнительный телефон',
    type: 'custom',
    render: number => number ? `+${number}` : 'Нет данных',
  },
  address: {
    name: 'Адрес',
    type: 'text',
  },
  pickUpAddress: {
    name: 'Адрес посадки',
    type: 'text',
  },
  foreman: {
    name: 'Бригадир',
    type: 'included',
    parse: foreman => foreman ? `${foreman.firstName} ${foreman.lastName}` : 'Нет данных',
  },
};

const hiddenButRequiredData = [
  'id',
  'foremanId',
  'berryId',
  ...(employeeFlags.map(({ value }) => value)),
];

const chips = Object.fromEntries(employeeFlags.map(({ value, text, color }) => ([
  value,
  {
    show: emp => emp[value],
    label: text,
    color,
  },
])));

const Employees = props => {
  const { updateSubTitle } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    updateSubTitle('Сотрудники');
  }, []);

  const [customFilters, setCustomFilters] = useState({});
  const [selected, setSelected] = useState([]);

  const onChangeFilters = values => {
    const { foremanId, flagsPresent, flagsAbsent } = values;

    if (flagsPresent.some(flag => flagsAbsent.includes(flag))) {
      notification.open({
        type: 'warning',
        title: 'Ошибка в фильтрах',
        text: 'Один и тот же флаг не может присутствовать и отсутствовать одновременно. Результаты могут быть неправильными.'
      });
    }

    setCustomFilters({
      ...(typeof foremanId === 'number' && { foremanId }),
      ...(Object.fromEntries(flagsPresent.map(flag => ([flag, true])))),
      ...(Object.fromEntries(flagsAbsent.map(flag => ([flag, false])))),
    });
  };

  const bulkUpdate = (data, refetch, forceLoading, forRows = null) => {
    forceLoading(true);

    request({
      url: `/employees/bulkUpdate`,
      method: 'PUT',
      body: {
        ids: (forRows || selected).map(({ id }) => id),
        ...data,
      },
      callback: (status, response) => {
        if (status === 'ok') {
          notification.open({
            type: 'success',
            title: 'Информация успешно обновлена',
          });
          refetch();

          setSelected([]);
        } else {
          notification.open({
            type: 'error',
            title: 'Ошибка при обновлении информации',
            text: response.message,
          });
        };
      },
    });
  };

  const filters = {
    fieldsData: {
      flagsPresent: {
        label: 'Фильтровать по наличию флага',
        type: 'multiple-select',
        defaultValue: [],
        multipleSelectConfig: {
          multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
        },
        style: { width: '30%', display: 'inline-block' },
      },
      flagsAbsent: {
        label: 'Фильтровать по отсутствию флага',
        type: 'multiple-select',
        defaultValue: [],
        multipleSelectConfig: {
          multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
        },
        style: { width: '30%', display: 'inline-block' },
      },
      foremanId: {
        label: 'Фильтровать по бригаде',
        type: 'fetch-select',
        fetchSelectConfig: {
          url: '/foremen',
          columns: {
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
          },
          showInOption: ['firstName', 'lastName'],
          showInValue: ['firstName', 'lastName'],
          returnValue: 'id',
        },
        style: { width: '20%', display: 'inline-block' },
        onChangeCallback: data => {
          setCustomFilters(data ? { foremanId: data?.id } : null);
        },
      },
    },
    className: 'inline-form',
    submitable: false,
    onChangeCallback: onChangeFilters,
  };


  const actions = {
    edit: {
      icon: <ModeEdit />,
      tooltip: 'Редактировать',
      action: (emp, router) => router.push(`${router.pathname}/${emp.id}`),
    },
    delete: {
      icon: <Delete />,
      tooltip: 'Удалить',
      action: (emp, _, refetch, forceLoading) => {
        const dialogKey = notification.open({
          type: 'warning',
          title: 'Удаление сотрудника',
          text: `Вы действительно хотите удалить сотрудника ${emp.firstName} ${emp.lastName}?`,
          actions: [{
            title: 'Удалить',
            action: () => {
              notification.close(dialogKey);

              forceLoading(true);

              request({
                url: `/employees/${emp.id}`,
                method: 'DELETE',
                callback: (status, response) => {
                  if (status === 'ok') {
                    notification.open({
                      type: 'success',
                      title: 'Сотрудник успешно удален',
                    });
                    refetch();
                  } else {
                    notification.open({
                      type: 'error',
                      title: 'Ошибка при удалении сотрудника',
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
    qrcode: {
      icon: <QrCode2 />,
      tooltip: 'Показать QR-код',
      action: (emp, router) => router.push(`${router.pathname}/${emp.id}/qrcode`),
    },
    select: {
      customRender: ({ id, berryId, firstName, lastName }) => (
        <Checkbox
          checked={!!selected.find(el => el.berryId === berryId)}
          disabled={selected.length >= 20 && !selected.includes(emp.id)}
          onChange={(_, checked) => {
            if (checked) {
              setSelected(curr => ([...curr, {
                id,
                berryId,
                QRCodeHtmlID: `${berryId}qrcode`,
                firstName,
                lastName,
              }]));
            } else {
              setSelected(curr => curr.filter(el => el.berryId !== berryId));
            }
          }}
        />
      ),
    },
  };

  const pageActions = {
    printAllPage: {
      customRender: (rows, _, refetch, forceLoading) => {
        const selectedData = rows.map(({ berryId, firstName, lastName }) => ({
          berryId,
          QRCodeHtmlID: `${berryId}qrcode`,
          firstName,
          lastName,
        }));

        return (
          <>
            <InvisibleQRCodes data={selectedData} />
            <PDFDownloadLink
              document={<MultipleQRCodes data={selectedData} />}
              fileName={`QRs.pdf`}
            >
              <Button
                variant="outlined"
                style={{ marginTop: '1em', marginLeft: '1em' }}
                startIcon={<QrCode2 />}
                disabled={!rows.length}
                onClick={() => bulkUpdate({ printedQR: true }, refetch, forceLoading, rows)}
              >
                Печатать всю страницу
              </Button>
            </PDFDownloadLink>
          </>
        );
      }
    },
    printSelected: {
      customRender: (_, __, refetch, forceLoading) => (
        <>
          <InvisibleQRCodes data={selected} />
          <PDFDownloadLink
            document={<MultipleQRCodes data={selected} />}
            fileName={`QRs.pdf`}
          >
            <Button
              variant="outlined"
              style={{ marginTop: '1em', marginLeft: '1em' }}
              startIcon={<QrCode2 />}
              disabled={!selected.length}
              onClick={() => bulkUpdate({ printedQR: true }, refetch, forceLoading)}
            >
              Печатать ({selected.length} сотрудников)
            </Button>
          </PDFDownloadLink>
        </>
      ),
    },
    isWorking: {
      icon: <Work />,
      title: `Поставить смену (${selected.length} сотрудников)`,
      action: (_, __, refetch, forceLoading) => bulkUpdate({ isWorking: true }, refetch, forceLoading),
      disabled: !selected.length,
    },
    isNotWorking: {
      icon: <WorkOff />,
      title: `Убрать смену (${selected.length} сотрудников)`,
      action: (_, __, refetch, forceLoading) => bulkUpdate({ isWorking: false }, refetch, forceLoading),
      disabled: !selected.length,
    },
    setFlags: {
      customRender: (_, __, refetch, forceLoading) => {
        return (
          <Form
            fieldsData={{
              setFlags: {
                label: 'Выберете флаги которые хотите установить',
                type: 'multiple-select',
                defaultValue: [],
                multipleSelectConfig: {
                  multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
                },
                style: { width: '25%', display: 'inline-block', marginLeft: '8px' },
              },
            }}
            className="inline-form"
            submitText="Установить"
            submitStyle={{ marginTop: '12px', marginLeft: '8px' }}
            disableSubmit={!selected.length}
            onSubmit={({ setFlags }) => {
              if (!setFlags.length) {
                notification.open({
                  type: 'warning',
                  title: 'Не выбрано ни одного флага',
                });
              } else {
                bulkUpdate(Object.fromEntries(setFlags.map(flag => ([flag, true]))), refetch, forceLoading);
              }
            }}
          />
        )
      }
    },
    removeFlags: {
      customRender: (_, __, refetch, forceLoading) => {
        return (
          <Form
            fieldsData={{
              removeFlags: {
                label: 'Выберете флаги которые хотите убрать',
                type: 'multiple-select',
                defaultValue: [],
                multipleSelectConfig: {
                  multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
                },
                style: { width: '25%', display: 'inline-block', marginLeft: '8px' },
              },
            }}
            className="inline-form"
            submitText="Убрать"
            submitStyle={{ marginTop: '12px', marginLeft: '8px' }}
            disableSubmit={!selected.length}
            onSubmit={({ removeFlags }) => {
              if (!removeFlags.length) {
                notification.open({
                  type: 'warning',
                  title: 'Не выбрано ни одного флага',
                });
              } else {
                bulkUpdate(Object.fromEntries(removeFlags.map(flag => ([flag, false]))), refetch, forceLoading);
              }
            }}
          />
        )
      }
    },
  };

  return (
    <div className="block">
      <PaginatedTable
        url={url}
        columns={columns}
        hiddenButRequiredData={hiddenButRequiredData}
        actions={actions}
        pageActions={pageActions}
        chips={chips}
        filters={filters}
        customFilters={customFilters}
        searchStyle={{ width: '20%', display: 'inline-block' }}
      />
    </div>
  )
};

export default Employees;
