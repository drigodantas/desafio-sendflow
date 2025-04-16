import { LoginPage, SignUpPage } from '../../pages';

export default {
  auth: false,
  header: false,
  children: [
    {
      id: 'login',
      path: '/',
      element: <LoginPage />,
    },
    {
      id: 'sign-up',
      path: '/sign-up',
      element: <SignUpPage />,
    },
  ],
};
