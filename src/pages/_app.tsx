import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/media';
import { GlobalStyle } from '../styles/reset';
import CanisterProvider from '../context/canister';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CanisterProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </CanisterProvider>
  )
}
