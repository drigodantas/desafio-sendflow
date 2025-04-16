import ConnectionsRoutes from '../connections/ConnectionsRoutes';
import ContactsRoutes from '../contacts/ContactsRoutes';
import LoginRoutes from '../login/LoginRoutes';
import MessagesRoutes from '../messages/MessagesRoutes';
import NotFoundRoutes from '../not-found/NotFoundRoutes';

const listRoutes = [
  ConnectionsRoutes,
  ContactsRoutes,
  MessagesRoutes,
  NotFoundRoutes,
  LoginRoutes,
];

export const allRoutes = listRoutes.flatMap((group) =>
  group.children.map((route) => ({
    ...route,
    auth: group.auth,
    header: group.header,
  })),
);
