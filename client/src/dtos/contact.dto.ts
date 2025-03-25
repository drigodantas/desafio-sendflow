import { Timestamp } from 'firebase/firestore';

export interface ContactDTO {
  id: string;
  name: string;
  number: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}
