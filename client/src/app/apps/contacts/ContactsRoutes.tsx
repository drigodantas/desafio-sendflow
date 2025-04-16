import { ContactsPage } from '../../pages';

export default {
  auth: true,
  header: true,
  children: [
    {
      id: 'contacts',
      path: '/contacts',
      element: <ContactsPage />,
    },
  ],
};
