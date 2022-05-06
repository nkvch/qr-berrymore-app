import { Document, Page, Text, Image, View, Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  names : {
    fontFamily : 'Roboto',
    fontSize: '12px',
  },
  qrcode: {
    height: '120px',
    width: '120px',
  },
});

const PDFIdCard = ({ QRCodeHtmlID, firstName, lastName }) => {
  const dataUrl = document.getElementById(QRCodeHtmlID).toDataURL();

  return (
    <Document>
      <Page orientation="landscape" size="B8" style={styles.page}>
        <View style={styles.names}>
          <Text>{ `${firstName} ${lastName}` }</Text>
        </View>
        <Image
          alt="QR code"
          src={dataUrl}
          style={styles.qrcode}
        />
      </Page>
    </Document>
  );
}

export default PDFIdCard;
