import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';

const QrCode = props => {
  const router = useRouter();
  const { id } = router.query;
  const { documentId } = props;

  return <div>
    { id ?
      <QRCode
        value={id}
        id={`${id}qrcode`}
      /> : id }
  </div>
}

export default QrCode;
