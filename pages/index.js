import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <meta name="description" content="Berrymore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
