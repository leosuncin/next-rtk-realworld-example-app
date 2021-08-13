import type { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Layout from '@app/components/layout';
import ListError from '@app/components/list-error';
import SignInForm from '@app/components/signin-form';
import {
  login,
  selectErrors,
  selectIsAuthenticated,
} from '@app/features/auth/auth.slice';
import { useDispatch, useSelector } from '@app/store';

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const errors = useSelector(selectErrors);

  useEffect(() => {
    if (!isAuthenticated) void router.replace('/');
  }, [isAuthenticated]);

  return (
    <Layout>
      <div className="auth-page">
        <main className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <NextLink href="/register">
                  <a>Need an account?</a>
                </NextLink>
              </p>
              <ListError error={errors} />
              <SignInForm
                onLoginUser={async (payload) => dispatch(login(payload))}
              />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Login;
