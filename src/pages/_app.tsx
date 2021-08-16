import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from '@app/app/store';
import Footer from '@app/common/footer';
import Navbar from '@app/common/navbar';

const App = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </PersistGate>
  </Provider>
);

export default App;
