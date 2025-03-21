import type { Timestamp } from 'firebase/firestore';

export interface MessageDTO {
  id: string;
  text: string;
  user_id: string;
  contacts_id: string[];
  send_date: Timestamp;
  status: 'scheduled' | 'sent';
}
