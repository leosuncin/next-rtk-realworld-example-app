export interface User {
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
}

interface Author extends Omit<User, 'email'> {
  following: boolean;
}

export interface Article {
  id: string | number;
  title: string;
  slug: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  tagList: string[];
  author: Author;
  favorited: boolean;
  favoritesCount: number;
}

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
}
export interface Register {
  email: string;
  password: string;
  username: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User & { token: string };
}

export interface ErrorResponse {
  errors: Record<string, string[]>;
}

export type PaginationParameters = { count?: number; page?: number };

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface TagsResponse {
  tags: string[];
}
