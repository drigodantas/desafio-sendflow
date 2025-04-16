import { MessagesPage, ScheduleMessagesPage } from '../../pages';

export default {
  auth: true,
  header: true,
  children: [
    {
      id: 'messages',
      path: '/messages',
      element: <MessagesPage />,
    },
    {
      id: 'schedule-messages',
      path: '/schedule-messages',
      element: <ScheduleMessagesPage />,
    },
  ],
};
