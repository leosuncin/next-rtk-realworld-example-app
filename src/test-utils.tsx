import type { EnhancedStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import { createRouter } from 'next/router';
import { Provider } from 'react-redux';

import { makeStore } from '@app/app/store';

class MockPageLoader {
  async getPageList() {
    return Promise.resolve([]);
  }

  async prefetch() {
    return Promise.resolve();
  }
}

export function createMockRouter(
  pathname = '/',
  query: Record<string, string | string[]> = {},
  asPath = pathname,
): NextRouter {
  return createRouter(pathname, query, asPath, {
    subscription: jest.fn().mockImplementation(Promise.resolve),
    initialProps: {},
    pageLoader: new MockPageLoader(),
    Component: jest.fn(),
    App: jest.fn(),
    wrapApp: jest.fn(),
    isFallback: false,
  });
}

function customRender(
  ui: Parameters<typeof render>[0],
  {
    store = makeStore(),
    router = createMockRouter(),
  }: { router?: NextRouter; store?: EnhancedStore } = {},
) {
  return render(
    <RouterContext.Provider value={router}>
      <Provider store={store}>{ui}</Provider>
    </RouterContext.Provider>,
  );
}

export { customRender as render };
