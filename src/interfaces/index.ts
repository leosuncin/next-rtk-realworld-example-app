import type { User } from '@app/features/auth/auth-api';

interface Author extends Omit<User, 'email'> {
  following: boolean;
}

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export interface TagsResponse {
  tags: string[];
}
