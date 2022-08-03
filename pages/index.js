import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss';
import Context from '../frontendWrapper/context';
import { useContext, useEffect } from 'react';

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
        <h1>Berrymore app</h1>
      </div>
    </div>
  )
}
