
export interface Block {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Apartment {
  id: string;
  number: string;
  block_id: string;
  floor: number;
  created_at: string;
  updated_at: string;
}
