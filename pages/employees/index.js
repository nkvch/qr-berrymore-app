import PaginatedTable from '../../frontendWrapper/components/PaginatedTable';
import Context from '../../frontendWrapper/context';
import { useContext, useEffect, useState } from 'react';
import { QrCode2, ModeEdit, Delete } from '@mui/icons-material';
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
  berryId: {
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

const Employees = props => {
  const { updateSubTitle } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    updateSubTitle('Сотрудники');
  }, []);

  const [foreman, setForeman] = useState(null);
  const [selected, setSelected] = useState([]);

  const filters = {
    fieldsData: {
      foremanId: {
        label: 'Фильтровать по бригаде',
        type: 'fetch-select',
        fetchSelectConfig: {
          url: '/foremen',
          className: 'autocomplete-inline-flex',
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
        onChangeCallback: data => {
          setForeman(data ? { foremanId: data?.id } : null);
        },
      },
    },
    className: 'inline-form',
    submitable: false,
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
      customRender: ({ berryId, firstName, lastName }) => (
        <Checkbox
          checked={!!selected.find(el => el.berryId === berryId)}
          disabled={selected.length >= 20 && !selected.includes(emp.id)}
          onChange={(_, checked) => {
            if (checked) {
              setSelected(curr => ([...curr, {
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

  return (
    <div className="block">
      <PaginatedTable
        url={url}
        columns={columns}
        actions={actions}
        pageActions={{
          printAllPage: {
            customRender: rows => {
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
                    >
                      Печатать всю страницу
                    </Button>
                  </PDFDownloadLink>
                </>
              );
            }
          },
          printSelected: {
            customRender: () => (
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
                  >
                    Печатать ({selected.length} сотрудников)
                  </Button>
                </PDFDownloadLink>
              </>
            ),
          },
        }}
        filters={filters}
        customFilters={foreman}
        classNames={{
          autocomplete: 'search70width',
        }}
      />
    </div>
  )
};

export default Employees;
