import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '../styles/theme';
import { GlobalStyle } from '../styles/global';

import Layout from '../components/templates/Layout';

function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Layout testId="app">
        <Component {...pageProps} />
      </Layout>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
