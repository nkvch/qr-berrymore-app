import { PDFDownloadLink } from '@react-pdf/renderer';
import { useRouter } from 'next/router';
import { QRCodeCanvas } from 'qrcode.react';
import PDFIdCard from '../../../frontendWrapper/components/PDFIdCard';
import useApi from '../../../frontendWrapper/utils/hooks/useApi';
import { CircularProgress } from '@mui/material';

const url = '/employees';

const QrCode = props => {
  const router = useRouter();
  const { id } = router.query;

  const { loading, data, fetchError } = useApi({ url: `${url}/${id}` }, {});
  const { firstName, lastName, berryId } = data || {};

  const QRCodeHtmlID = `${berryId}qrcode`;

  return (
    <div className='block'>
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
              Скачать PDF
            </PDFDownloadLink>
          </>
        ) : null
      }
    </div>
  )
}

export default QrCode;
