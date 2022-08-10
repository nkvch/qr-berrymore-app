import { Download } from "@mui/icons-material";
import { Button, LinearProgress } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import LinearProgressWithLabel from "../frontendWrapper/components/LinearProgessWithLabel";
import LinearWithValueLabel from "../frontendWrapper/components/LinearProgessWithLabel";
import { notification } from '../frontendWrapper/components/notifications';
import Context from "../frontendWrapper/context";
import withInterval from "../frontendWrapper/utils/withInterval";

const DownloadPage = () => {
  const [progress, setProgress] = useState(0);
  const { updateSubTitle } = useContext(Context);

  const updateProgress = ({ loaded, total }) => {
    setProgress((loaded/total) * 100);
  };

  useEffect(() => {
    updateSubTitle('Download app');
  }, []);

  const downloadApp = () => {
    fetch('/downloadAndroidApp', {
      headers: {
        Accept: 'application/vnd.android.package-archive',
        'Content-Type': 'application/vnd.android.package-archive',
      },
     })
      .then(response => {
        const contentEncoding = response.headers.get('content-encoding');
        const contentLength = response.headers.get(contentEncoding ? 'x-file-size' : 'content-length');
        const contentType = response.headers.get('content-type');
        if (contentLength === null) {
            throw Error('Response size header unavailable');
        }

        const total = parseInt(contentLength, 10);
        let loaded = 0;

        return new Response(
            new ReadableStream({
                start(controller) {
                    const reader = response.body.getReader();

                    read();

                    function read() {
                        reader.read().then(({done, value}) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            loaded += value.byteLength;

                            try {
                              withInterval(() => {
                                updateProgress({loaded, total});
                              }, 500);
                            } catch (err) {
                              console.error(err);
                            }

                            controller.enqueue(value);
                            read();
                        }).catch(error => {
                            console.error(error);
                            controller.error(error)
                        })
                    }
                }
            })
        );
      })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "BerrymoreApp.apk";
        document.body.appendChild(a);
        a.click();    
        a.remove();  
      })
      .catch(res => {
        notification.open({
          type: 'error',
          title: 'Error while downloading',
          text: `Error while downloading the app: ${res.toString()}`,
        });
      });
  };

  return (
    <div className="block">
      {
        progress ? (
          <LinearProgressWithLabel value={progress} />
        ) : null
      }
      <Button
        variant="contained"
        style={{ marginTop: '10px' }}
        onClick={downloadApp}
        endIcon={<Download />}
      >
        Download app
      </Button>
    </div>
  )
};

export default DownloadPage;
