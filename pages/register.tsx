import type { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Layout from '@app/components/layout';
import ListError from '@app/components/list-error';
import SignUpForm from '@app/components/signup-form';
import { useDispatch, useSelector } from '@app/store';
import { register, selectAuthState } from '@app/store/slices/auth.slice';

const RegisterPage: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { errors, user } = useSelector(selectAuthState);

  useEffect(() => {
    if (user && !errors) void router.replace('/');
  }, [user]);

  return (
    <Layout>
      <div className="auth-page">
        <main className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <NextLink href="/login">
                  <a>Have an account?</a>
                </NextLink>
              </p>
              <ListError error={errors} />
              <SignUpForm
                onRegisterUser={async (payload) => dispatch(register(payload))}
              />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default RegisterPage;
