// src/types/index.ts

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
  tags: Tag[];
  likes_count: number;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  published_at?: string;
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
