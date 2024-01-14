import Rect from 'react';
import Head from 'next/head';
import Header from '../components/Common/Header';
import Exhibitions from '../components/Exhibitions';
import Footer from '../components/Common/Footer';

const ExplorePage = () => {

  return (
    <>
      <Head>
        <title>Explore</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Exhibitions />
      <Footer />
    </>
  )
}

export default ExplorePage;