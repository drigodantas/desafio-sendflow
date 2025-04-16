import { ConnectionsPage } from '../../pages';

export default {
  auth: true,
  header: true,
  children: [
    {
      id: 'connections',
      path: '/connections',
      element: <ConnectionsPage />,
    },
  ],
};
