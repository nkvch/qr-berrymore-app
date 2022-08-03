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
  { value: 'called', text: 'Звонили', color: '#c75fed' },
];

const columns = {
  contract: {
    name: 'Contract #',
    type: 'text',
  },
  lastName: {
    name: 'Last Name',
    type: 'text',
  },
  firstName: {
    name: 'First Name',
    type: 'text',
  },
  phone: {
    name: 'Телефон',
    type: 'custom',
    render: number => number ? `+${number}` : 'Нет данных',
  },
  address: {
    name: 'Address',
    type: 'text',
  },
  pickUpAddress: {
    name: 'Pick up address',
    type: 'text',
  },
  foreman: {
    name: 'Foreman',
    type: 'included',
    parse: foreman => foreman ? `${foreman.firstName} ${foreman.lastName}` : 'No data',
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
    updateSubTitle('Employees');
  }, []);

  const [customFilters, setCustomFilters] = useState({});
  const [selected, setSelected] = useState([]);

  const onChangeFilters = values => {
    const { foremanId, flagsPresent, flagsAbsent } = values;

    if (flagsPresent.some(flag => flagsAbsent.includes(flag))) {
      notification.open({
        type: 'warning',
        title: 'Filters contain mistake',
        text: 'The same flag can\'t be present and absent at the same time. Results may be wrong.'
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
        ...(!all && {
          ids: (forRows || selected).map(({ id }) => id),
        }),
        ...data,
      },
      callback: (status, response) => {
        if (status === 'ok') {
          notification.open({
            type: 'success',
            title: 'Successfully updated data',
          });
          refetch();

          setSelected([]);
        } else {
          notification.open({
            type: 'error',
            title: 'Error while updating data',
            text: response.message,
          });
        };
      },
    });
  };

  const filters = {
    fieldsData: {
      flagsPresent: {
        label: 'Filter by flag presence',
        type: 'multiple-select',
        defaultValue: [],
        multipleSelectConfig: {
          multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
        },
        style: { width: '30%', display: 'inline-block' },
      },
      flagsAbsent: {
        label: 'Filter by flag absence',
        type: 'multiple-select',
        defaultValue: [],
        multipleSelectConfig: {
          multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
        },
        style: { width: '30%', display: 'inline-block' },
      },
      foremanId: {
        label: 'Filter by brigade',
        type: 'fetch-select',
        fetchSelectConfig: {
          url: '/foremen',
          columns: {
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
      tooltip: 'Edit',
      action: (emp, router) => router.push(`${router.pathname}/${emp.id}`),
    },
    delete: {
      icon: <Delete />,
      tooltip: 'Delete',
      action: (emp, _, refetch, forceLoading) => {
        const dialogKey = notification.open({
          type: 'warning',
          title: 'Deleting employee',
          text: `Are you sure you want to delete employee ${emp.firstName} ${emp.lastName}?`,
          actions: [{
            title: 'Delete',
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
                      title: 'Employee was deleted successfully',
                    });
                    refetch();
                  } else {
                    notification.open({
                      type: 'error',
                      title: 'Error while deleting employee',
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
    qrcode: {
      icon: <QrCode2 />,
      tooltip: 'Show QR-code',
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
                Print whole page
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
              Print ({selected.length} employees)
            </Button>
          </PDFDownloadLink>
        </>
      ),
    },
    isWorking: {
      icon: <Work />,
      title: `Work (${selected.length} employees)`,
      action: (_, __, refetch, forceLoading) => bulkUpdate({ isWorking: true }, refetch, forceLoading),
      disabled: !selected.length,
    },
    isNotWorking: {
      icon: <WorkOff />,
      title: `Don't work (${selected.length} employees)`,
      action: (_, __, refetch, forceLoading) => bulkUpdate({ isWorking: false }, refetch, forceLoading),
      disabled: !selected.length,
    },
    allNotWorking: {
      icon: <WorkOff />,
      title: 'Убрать смену (у всех)',
      action: (_, __, refetch, forceLoading) => bulkUpdate({ isWorking: false }, refetch, forceLoading, null, true),
    },
    forgetCalls: {
      icon: <PhoneDisabled />,
      title: 'Отчистить историю звонков',
      action: (_, __, refetch, forceLoading) => bulkUpdate({ called: false }, refetch, forceLoading, null, true),
    },
    setFlags: {
      customRender: (_, __, refetch, forceLoading) => {
        return (
          <Form
            fieldsData={{
              setFlags: {
                label: 'Choose flags to set',
                type: 'multiple-select',
                defaultValue: [],
                multipleSelectConfig: {
                  multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
                },
                style: { width: '25%', display: 'inline-block', marginLeft: '8px' },
              },
            }}
            className="inline-form"
            submitText="Set"
            submitStyle={{ marginTop: '12px', marginLeft: '8px' }}
            disableSubmit={!selected.length}
            onSubmit={({ setFlags }) => {
              if (!setFlags.length) {
                notification.open({
                  type: 'warning',
                  title: 'No flags selected',
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
                label: 'Choose flags to remove',
                type: 'multiple-select',
                defaultValue: [],
                multipleSelectConfig: {
                  multipleOptions: employeeFlags.map(({ value, text }) => ({ value, text })),
                },
                style: { width: '25%', display: 'inline-block', marginLeft: '8px' },
              },
            }}
            className="inline-form"
            submitText="Remove"
            submitStyle={{ marginTop: '12px', marginLeft: '8px' }}
            disableSubmit={!selected.length}
            onSubmit={({ removeFlags }) => {
              if (!removeFlags.length) {
                notification.open({
                  type: 'warning',
                  title: 'No flags selected',
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
