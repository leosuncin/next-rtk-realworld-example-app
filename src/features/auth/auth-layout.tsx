import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect } from 'react';

import ListError from '@app/components/list-error';
import {
  selectErrors,
  selectIsAuthenticated,
} from '@app/features/auth/auth.slice';
import { useSelector } from '@app/store';

export type AuthLayoutProps = {
  isRegister?: boolean;
};

function AuthLayout({
  children,
  isRegister,
}: PropsWithChildren<AuthLayoutProps>) {
  const router = useRouter();
  const errors = useSelector(selectErrors);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      void router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <main className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">
              {isRegister ? 'Sign Up' : 'Sign In'}
            </h1>
            <p className="text-xs-center">
              {isRegister ? (
                <NextLink href="/login">Have an account?</NextLink>
              ) : (
                <NextLink href="/register">Need an account?</NextLink>
              )}
            </p>

            <ListError error={errors} />

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
