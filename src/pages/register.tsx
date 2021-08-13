import type { NextPage } from 'next';

import Layout from '@app/components/layout';
import AuthLayout from '@app/features/auth/auth-layout';
import { register } from '@app/features/auth/auth.slice';
import SignUpForm from '@app/features/auth/signup-form';
import { useDispatch } from '@app/store';

const RegisterPage: NextPage = () => {
  const dispatch = useDispatch();

  return (
    <Layout>
      <AuthLayout isRegister>
        <SignUpForm
          onRegisterUser={async (payload) => dispatch(register(payload))}
        />
      </AuthLayout>
    </Layout>
  );
};

export default RegisterPage;
