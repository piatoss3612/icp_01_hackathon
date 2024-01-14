import React from 'react';
import Head from 'next/head';
import Header from '../components/Common/Header';
import CreateExhibition from '../components/CreateExhibition';
import Footer from '../components/Common/Footer';

const CreateExhibitionPage = () => {
  return (
    <>
      <Head>
        <title>Create Exhibition</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <CreateExhibition />
      <Footer />
    </>
  )
}

export default CreateExhibitionPage;