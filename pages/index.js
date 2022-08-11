import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss';
import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';
import { Card, Grid, CardMedia, Typography, CardContent, CardActionArea, CardActions, Button, Divider } from '@mui/material';

export default function Home() {
  const { updateSubTitle } = useContext(Context);

  useEffect(() => {
    updateSubTitle('Main page');
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Berrymore|MainPage</title>
        <meta name="description" content="Berry farm maintenance solution" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="block">
        <h1 className="main-page-header">Berrymore app</h1>
        <div className="divider-container">
          <Divider />
        </div>
        <p className="main-page-paragraph">{'"Berrymore" berry farm maintenance system is a system which works on production on real berry farm and has been duplicated by me on this public domain to show my current developer skills :D. Purpose is simple: to track all portions of berry collected by all employees and count the statistics, calculating employee salaries. Registration of new portion is being done via QR on android app which is installed on phone of every foreman (employee-superviser). Every employee has his own QR code (generating and printing one (or more) can be done in "Employees" section). When foreman scans employee\'s QR code using android app, form to fill amount of berry appears. After submission record lands in statistics. App is using NextJS, with MaterialUI on frontend and AWS RDS database on backend.'}</p>
        <Grid container spacing={2} className="main-page-grid">
          <Grid item xs={4}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="240"
                  image="phonePhoto3.JPG"
                  alt="App launched on phone photo"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Android app
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="main-page-descriptions">
                    {'Berrymore app provides Android App client to observe statistics and register new pickings via QR. APK can be downloaded directly from Download page by clickng "Download App"'} 
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary" type="button" href="download">
                  Go to download (.APK)
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="240"
                  image="employeesScreen.png"
                  alt="Screenshot of Employees page"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Managing employees
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="main-page-descriptions">
                    Employees page allows you to manage employees by applying flags to selected ones, filter by flag, print QR-codes of selected ones, or preview
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary" type="button" href="employees">
                  Go to Employees
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="240"
                  image="charts.png"
                  alt="Screenshot of Statistics page"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Observing stats
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="main-page-descriptions">
                    Statistics page allows you to observe stats from any period of time and count salary while filtering by employee, foreman, employee flag, etc.
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary" type="button" href="stats">
                  Go to Statistics
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="240"
                  image="qrs.png"
                  alt="Screenshot of QRs to print"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Generate QRs
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="main-page-descriptions">
                    {'On Employees page you can select some employees by ticking them, after that you can click "Print selected" and ready to print PDF containing badges with QR codes will be downloaded.'}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary" type="button" href="employees">
                  Go to Employees
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
