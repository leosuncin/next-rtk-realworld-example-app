import { render, screen } from '@testing-library/react';

import UserListPage from '@app/pages/users/index';

describe('<UserListPage />', () => {
  it('should render', () => {
    const { baseElement } = render(<UserListPage items={[]} />);

    expect(baseElement).toBeInTheDocument();
    expect(
      screen.getByText(/users list/i, { selector: 'h1' }),
    ).toBeInTheDocument();
  });
});
