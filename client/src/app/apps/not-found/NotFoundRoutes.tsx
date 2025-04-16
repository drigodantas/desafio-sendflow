import { NotFoundPage } from '../../pages';

export default {
  auth: true,
  header: true,
  children: [
    {
      id: 'not-found',
      path: '*',
      element: <NotFoundPage />,
    },
  ],
};
