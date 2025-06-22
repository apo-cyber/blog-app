// src/types/index.ts

// ユーザー型
export interface User {
  id: number;
  username: string;
  email: string;
}

// タグ型
export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

// ブログ記事型
export interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string | null;
  author: User;
  tags: Tag[];
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  published_at?: string;
}

// ブログ記事作成・更新用の型
export interface BlogPostInput {
  title: string;
  description: string;
  image?: File | null;
  tag_ids: number[];
  is_published: boolean;
}

// いいね型
export interface Like {
  id: number;
  user: User;
  blog_post: number;
  blog_post_title: string;
  created_at: string;
}

// ページネーション型
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// APIエラー型
export interface ApiError {
  detail?: string;
  [key: string]: any;
}
