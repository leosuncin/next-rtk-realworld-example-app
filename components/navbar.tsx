import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useSelector } from '@app/store';
import { selectUser } from '@app/store/slices/auth.slice';

interface NavbarRoute {
  path: string;
  text: string;
  icon?: JSX.Element;
}

const unauthenticatedRoutes: NavbarRoute[] = [
  {
    path: '/',
    text: 'Home',
  },
  {
    path: '/login',
    text: 'Sign in',
  },
  {
    path: '/register',
    text: 'Sign up',
  },
];
const authenticatedRoutes: NavbarRoute[] = [
  {
    path: '/',
    text: 'Home',
  },
  {
    path: '/editor',
    icon: <i className="ion-compose"></i>,
    text: 'New Post',
  },
  {
    path: '/settings',
    icon: <i className="ion-gear-a"></i>,
    text: 'Settings',
  },
];

function Navbar() {
  const currentUser = useSelector(selectUser);
  const router = useRouter();
  const isAuthenticaded = Boolean(currentUser);
  const routes: NavbarRoute[] = isAuthenticaded
    ? [
        ...authenticatedRoutes,
        {
          path: `/@${currentUser?.username!}`,
          icon: currentUser?.image ? (
            <img
              src={currentUser?.image}
              className="user-pic"
              alt={currentUser?.username}
            />
          ) : undefined,
          text: currentUser?.username!,
        },
      ]
    : unauthenticatedRoutes;

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <NextLink href="/">
          <a className="navbar-brand">conduit</a>
        </NextLink>
        <ul className="nav navbar-nav pull-xs-right">
          {routes.map((route) => (
            <li key={route.path} className="nav-item">
              <NextLink href={route.path}>
                <a
                  className={`nav-link${
                    router.pathname === route.path ? ' active' : ''
                  }`}
                >
                  {route.icon}&nbsp;{route.text}
                </a>
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
