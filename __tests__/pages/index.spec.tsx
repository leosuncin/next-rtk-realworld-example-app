import { render, screen } from '@testing-library/react';

import IndexPage from '@app/pages/index';

describe('<IndexPage />', () => {
  it('should render', () => {
    const { baseElement } = render(<IndexPage />);

    expect(baseElement).toBeInTheDocument();
    expect(screen.getByText(/hello next.js/i)).toBeInTheDocument();
  });
});
