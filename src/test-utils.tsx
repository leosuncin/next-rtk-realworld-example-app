import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import { createRouter } from 'next/router';
import { Provider } from 'react-redux';

import { makeStore } from '@app/app/store';

function customRender(
  ui: Parameters<typeof render>[0],
  {
    store = makeStore(),
    router = createRouter('/', {}, '/', {
      subscription: jest.fn().mockImplementation(Promise.resolve),
      initialProps: {},
      pageLoader: jest.fn(),
      Component: jest.fn(),
      App: jest.fn(),
      wrapApp: jest.fn(),
      isFallback: false,
    }),
  }: { router?: NextRouter; store?: EnhancedStore } = {},
) {
  return render(
    <RouterContext.Provider value={router}>
      <Provider store={store}>{ui}</Provider>
    </RouterContext.Provider>,
  );
}

export { customRender as render };
