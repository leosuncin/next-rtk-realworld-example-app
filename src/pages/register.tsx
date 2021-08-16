import type { NextPage } from 'next';

import { useDispatch } from '@app/app/hooks';
import AuthLayout from '@app/features/auth/auth-layout';
import { register } from '@app/features/auth/auth.slice';
import SignUpForm from '@app/features/auth/signup-form';

const RegisterPage: NextPage = () => {
  const dispatch = useDispatch();

  return (
    <AuthLayout isRegister>
      <SignUpForm
        onRegisterUser={async (payload) => dispatch(register(payload))}
      />
    </AuthLayout>
  );
};

export default RegisterPage;
