import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useSelector } from '@app/app/hooks';
import {
  selectIsAuthenticated,
  selectUser,
} from '@app/features/auth/auth.slice';

function LoggedOutNavbar() {
  const router = useRouter();
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <NextLink href="/">
          <a
            className={router.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </a>
        </NextLink>
      </li>

      <li className="nav-item">
        <NextLink href="/login">
          <a
            className={
              router.pathname === '/login' ? 'nav-link active' : 'nav-link'
            }
          >
            Sign in
          </a>
        </NextLink>
      </li>

      <li className="nav-item">
        <NextLink href="/register">
          <a
            className={
              router.pathname === '/register' ? 'nav-link active' : 'nav-link'
            }
          >
            Sign up
          </a>
        </NextLink>
      </li>
    </ul>
  );
}

function LoggedInNavbar() {
  const router = useRouter();
  const currentUser = useSelector(selectUser)!;

  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <NextLink href="/">
          <a
            className={router.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </a>
        </NextLink>
      </li>

      <li className="nav-item">
        <NextLink href="/editor">
          <a
            className={
              router.pathname === '/editor' ? 'nav-link active' : 'nav-link'
            }
          >
            <i className="ion-compose" />
            &nbsp;New Post
          </a>
        </NextLink>
      </li>

      <li className="nav-item">
        <NextLink href="/settings">
          <a
            className={
              router.pathname === '/settings' ? 'nav-link active' : 'nav-link'
            }
          >
            <i className="ion-gear-a" />
            &nbsp;Settings
          </a>
        </NextLink>
      </li>

      <li className="nav-item">
        <NextLink href={`/@${currentUser.username}`}>
          <a
            className={
              router.pathname === `/@${currentUser.username}`
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            <img
              src={
                currentUser.image ??
                'https://static.productionready.io/images/smiley-cyrus.jpg'
              }
              className="user-pic"
              alt={currentUser.username}
            />
            {currentUser.username}
          </a>
        </NextLink>
      </li>
    </ul>
  );
}

function Navbar() {
  const isAuthenticaded = useSelector(selectIsAuthenticated);

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <NextLink href="/">
          <a className="navbar-brand">conduit</a>
        </NextLink>

        {isAuthenticaded ? <LoggedInNavbar /> : <LoggedOutNavbar />}
      </div>
    </nav>
  );
}

export default Navbar;
