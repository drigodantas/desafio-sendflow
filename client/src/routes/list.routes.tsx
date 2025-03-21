import {
  ConnectionsPage,
  ContactsPage,
  LoginPage,
  MessagesPage,
  NotFoundPage,
  ScheduleMessagesPage,
  SignUpPage,
} from '../pages';

export const listRoutes = [
  {
    id: 'login',
    element: <LoginPage />,
    path: '/',
    auth: false,
  },
  {
    id: 'sign-up',
    element: <SignUpPage />,
    path: '/sign-up',
    auth: false,
  },
  {
    id: 'not-found',
    element: <NotFoundPage />,
    path: '*',
    auth: false,
  },
  {
    id: 'connections',
    element: <ConnectionsPage />,
    path: '/connections',
    auth: true,
  },
  {
    id: 'contacts',
    element: <ContactsPage />,
    path: '/contacts',
    auth: true,
  },
  {
    id: 'messages',
    element: <MessagesPage />,
    path: '/messages',
    auth: true,
  },
  {
    id: 'schedule-messages',
    element: <ScheduleMessagesPage />,
    path: '/schedule-messages',
    auth: true,
  },
];
