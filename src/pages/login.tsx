import type { NextPage } from 'next';

import Layout from '@app/components/layout';
import AuthLayout from '@app/features/auth/auth-layout';
import { login } from '@app/features/auth/auth.slice';
import SignInForm from '@app/features/auth/signin-form';
import { useDispatch } from '@app/store';

const Login: NextPage = () => {
  const dispatch = useDispatch();

  return (
    <Layout>
      <AuthLayout>
        <SignInForm onLoginUser={async (payload) => dispatch(login(payload))} />
      </AuthLayout>
    </Layout>
  );
};

export default Login;
