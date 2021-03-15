import { render, screen } from '@testing-library/react';

import AboutPage from '../../pages/about';

describe('<AboutPage />', () => {
  it('should render', () => {
    const { baseElement } = render(<AboutPage />);

    expect(baseElement).toBeInTheDocument();
    expect(screen.getByText(/about page/i)).toBeInTheDocument();
  });
});
