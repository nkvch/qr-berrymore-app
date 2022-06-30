import { QRCodeCanvas } from "qrcode.react";

const InvisibleQRCodes = ({ data }) => (
  <>
    {
      data.map(({ berryId, QRCodeHtmlID }) => (
        <QRCodeCanvas
          id={QRCodeHtmlID}
          value={berryId}
          key={`${berryId}qrcanvaskey`}
          style={{ display: 'none' }}
        />
      ))
    }
  </>
);

export default InvisibleQRCodes;
