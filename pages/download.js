import { Download } from "@mui/icons-material";
import { Button } from "@mui/material";
import { notification } from '../frontendWrapper/components/notifications';

const DownloadPage = () => {
  const downloadApp = () => fetch('/downloadAndroidApp', {
    headers: {
      Accept: 'application/vnd.android.package-archive',
      'Content-Type': 'application/vnd.android.package-archive',
    },
   })
    .then(res => res.blob())
    .then(blob => {
      var file = window.URL.createObjectURL(blob);
      window.location.assign(file);
    })
    .catch(res => {
      notification.open({
        title: 'Ошибка при загрузке',
        text: `Ошибка при загрузке приложения: ${res.toString()}`,
      });
    });

  return (
    <div className="block">
      <Button
        variant="contained"
        style={{ marginTop: '10px' }}
        onClick={downloadApp}
        endIcon={<Download />}
      >
        Скачать приложение
      </Button>
    </div>
  )
};

export default DownloadPage;
