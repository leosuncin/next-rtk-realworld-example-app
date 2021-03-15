import { render, screen } from '@testing-library/react';

import UserDetailsPage from '@app/pages/users/[id]';

describe('<UserListPage />', () => {
  it('should render', () => {
    const { baseElement } = render(
      <UserDetailsPage item={{ id: 1, name: 'John' }} />,
    );

    expect(baseElement).toBeInTheDocument();
    expect(screen.getByText(/detail for/i)).toBeInTheDocument();
  });
});
