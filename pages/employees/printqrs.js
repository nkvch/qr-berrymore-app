import { useRouter } from "next/router";
import { useContext } from "react";
import useApi from "../../frontendWrapper/utils/hooks/useApi";
import Context from "../../frontendWrapper/context";
import { QRCodeCanvas } from "qrcode.react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button, CircularProgress } from "@mui/material";
import MultipleQRCodes from "../../frontendWrapper/components/MultipleQRCodes";

const Printqrs = () => {
  const router = useRouter();
  const { selected } = router.query;

  const { updateSubTitle } = useContext(Context);

  const { loading, data, fetchError } = useApi({ url: '/employees' }, {
    id: selected,
    qty: -1,
  });

  const dataForPdf = data?.pageData.map(({ berryId, firstName, lastName }) => ({
    berryId,
    QRCodeHtmlID: `${berryId}qrcode`,
    firstName,
    lastName,
  }));

  // const { firstName, lastName, berryId } = data || {};

  // const QRCodeHtmlID = `${berryId}qrcode`;

  return (
    <div className="block">
      {
        dataForPdf ? (
          <>
            <div>
              {
                dataForPdf.map(({ berryId, QRCodeHtmlID }) => (
                  <QRCodeCanvas
                    id={QRCodeHtmlID}
                    value={berryId}
                    key={`${berryId}qrcanvaskey`}
                    style={{ display: 'none' }}
                  />
                ))
              }
            </div>
            <PDFDownloadLink
              document={<MultipleQRCodes data={dataForPdf} />}
              fileName={`QRs.pdf`}
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
        ) : <CircularProgress />
      }
    </div>
  )
};

export default Printqrs;
