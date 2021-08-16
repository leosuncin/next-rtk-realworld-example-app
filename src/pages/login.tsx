import type { NextPage } from 'next';

import { useDispatch } from '@app/app/hooks';
import AuthLayout from '@app/features/auth/auth-layout';
import { login } from '@app/features/auth/auth.slice';
import SignInForm from '@app/features/auth/signin-form';

const Login: NextPage = () => {
  const dispatch = useDispatch();

  return (
    <AuthLayout>
      <SignInForm onLoginUser={async (payload) => dispatch(login(payload))} />
    </AuthLayout>
  );
};

export default Login;
