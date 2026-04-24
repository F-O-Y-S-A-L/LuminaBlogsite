export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  coverImage?: string
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: number;
  authorName: string;
  category: string;
  coverImage: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}
