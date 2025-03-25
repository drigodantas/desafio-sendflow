import { Timestamp } from 'firebase/firestore';

export interface ConnectionDTO {
  id: string;
  name: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}
