import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect, useState } from 'react';
import { QrCode2, ModeEdit, Delete, Work, WorkOff, Print, CancelPresentation } from '@mui/icons-material';
import request from '../../frontendWrapper/utils/request';
import { notification } from '../../frontendWrapper/components/notifications';
import { Button, Checkbox, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { QRCodeCanvas } from 'qrcode.react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MultipleQRCodes from '../../frontendWrapper/components/MultipleQRCodes';
import InvisibleQRCodes from '../../frontendWrapper/components/InvisibleQRCodes';

const url = '/employees';

const columns = {
  id: {
    name: 'ID',
    type: 'number',
    hidden: true,
  },
  contract: {
    name: 'Номер кантракта',
    type: 'text',
  },
  foremanId: {
    type: 'number',
    hidden: true,
  },
  firstName: {
    name: 'Имя',
    type: 'text',
  },
  lastName: {
    name: 'Фамилия',
    type: 'text',
  },
  address: {
    name: 'Адрес',
    type: 'text',
  },
  pickUpAddress: {
    name: 'Адрес посадки',
    type: 'text',
  },
  berryId: {
    hidden: true,
  },
  workTomorrow: {
    hidden: true,
  },
  printedQR: {
    hidden: true,
  },
  photoPath: {
    name: 'Фото',
    type: 'image',
  },
  foreman: {
    name: 'Бригадир',
    type: 'included',
    parse: foreman => foreman ? `${foreman.firstName} ${foreman.lastName}` : 'Нет данных',
  },
};

const chips = {
  workTomorrow: {
    show: emp => emp.workTomorrow,
    label: 'Работает завтра',
    color: 'error'
  },
  printedQR: {
    show: emp => emp.printedQR,
    label: 'QR распечатан',
    color: 'primary',
  }
};

const Employees = props => {
  const { updateSubTitle } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    updateSubTitle('Сотрудники');
  }, []);

  const [customFilters, setCustomFilters] = useState({});
  const [selected, setSelected] = useState([]);

  const onChangeFilters = values => {
    const { foremanId, workTomorrow, printedQR } = values;
    setCustomFilters({
      ...(typeof foremanId === 'number' && { foremanId }),
      ...(workTomorrow !== 'null' && { workTomorrow }),
      ...(printedQR !== 'null' && { printedQR }),
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
      workTomorrow: {
        label: 'Фильтровать по смене',
        type: 'select',
        selectConfig: {
          options: [
            { value: 'true', text: 'Работающие завтра' },
            { value: 'false', text: 'Не работающие завтра' },
            { value: 'null', text: 'Все' },
          ],
        },
        defaultValue: 'null',
        style: { width: '20%' },
      },
      printedQR: {
        label: 'Фильтровать по QR',
        type: 'select',
        selectConfig: {
          options: [
            { value: 'true', text: 'Уже распечатан' },
            { value: 'false', text: 'Еще не распечатан' },
            { value: 'null', text: 'Все' },
          ],
        },
        defaultValue: 'null',
        style: { width: '20%' },
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
    workTommorow: {
      icon: <Work />,
      title: `Поставить смену (${selected.length} сотрудников)`,
      action: (_, __, refetch, forceLoading) => bulkUpdate({ workTomorrow: true }, refetch, forceLoading),
      disabled: !selected.length,
    },
    dontWorkTommorow: {
      icon: <WorkOff />,
      title: `Убрать смену (${selected.length} сотрудников)`,
      action: (_, __, refetch, forceLoading) => bulkUpdate({ workTomorrow: false }, refetch, forceLoading),
      disabled: !selected.length,
    },
    removeQRPrintedFlags: {
      icon: <CancelPresentation />,
      title: `Убрать метки "QR распечатан" (${selected.length} сотрудников)`,
      action: (_, __, refetch, forceLoading) => bulkUpdate({ printedQR: false }, refetch, forceLoading),
      disabled: !selected.length,
    },
  };

  return (
    <div className="block">
      <PaginatedTable
        url={url}
        columns={columns}
        actions={actions}
        pageActions={pageActions}
        chips={chips}
        filters={filters}
        customFilters={customFilters}
        searchStyle={{ width: '40%', display: 'inline-block' }}
        // classNames={{
        //   autocomplete: 'search70width',
        // }}
      />
    </div>
  )
};

export default Employees;
