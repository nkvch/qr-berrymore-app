import { PDFDownloadLink } from '@react-pdf/renderer';
import { useRouter } from 'next/router';
import { QRCodeCanvas } from 'qrcode.react';
import PDFIdCard from '../../../frontendWrapper/components/PDFIdCard';
import useApi from '../../../frontendWrapper/utils/hooks/useApi';
import { Button, CircularProgress } from '@mui/material';
import Context from '../../../frontendWrapper/context';
import { useContext, useEffect } from 'react';

const url = '/employees';

const QrCode = props => {
  const router = useRouter();
  const { id } = router.query;
  const { updateSubTitle } = useContext(Context);

  const { loading, data, fetchError } = useApi({ url: `${url}/${id}` }, {});
  const { firstName, lastName, berryId } = data || {};

  const QRCodeHtmlID = `${berryId}qrcode`;

  useEffect(() => {
    updateSubTitle(`QR код: ${firstName} ${lastName}`);
  }, []);

  return (
    <div className='block flex-center-column'>
      {
        loading ? <CircularProgress /> : null
      }
      {
        berryId ? (
          <>
            <QRCodeCanvas
              value={berryId}
              id={QRCodeHtmlID}
            />
            <PDFDownloadLink
              document={<PDFIdCard QRCodeHtmlID={QRCodeHtmlID} firstName={firstName} lastName={lastName} />}
              fileName={`${firstName}${lastName}QR.pdf`}
            >
              <Button
                type="submit"
                variant="contained"
                style={{ marginTop: '10px' }}
              >
                Скачать PDF
              </Button>
            </PDFDownloadLink>
          </>
        ) : null
      }
    </div>
  )
}

export default QrCode;
