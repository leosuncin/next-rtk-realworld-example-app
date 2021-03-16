import { render, screen } from '@testing-library/react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import { Provider } from 'react-redux';

import IndexPage from '@app/pages/index';
import store from '@app/store';

describe('<IndexPage />', () => {
  it('should render', () => {
    const routerMocked: jest.Mocked<NextRouter> = {
      pathname: '/',
      route: '/',
      isPreview: false,
      query: {},
      asPath: '/',
      basePath: '',
      isFallback: false,
      isReady: true,
      isLocaleDomain: true,
      events: { emit: jest.fn(), off: jest.fn(), on: jest.fn() },
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
    };
    const { baseElement } = render(
      <RouterContext.Provider value={routerMocked}>
        <Provider store={store}>
          <IndexPage />
        </Provider>
      </RouterContext.Provider>,
    );

    expect(baseElement).toBeInTheDocument();
    expect(
      screen.getByText(/a place to share your knowledge/i),
    ).toBeInTheDocument();
  });
});
