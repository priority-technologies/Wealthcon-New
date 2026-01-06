
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnailUrl: string;
  heroImageUrl: string;
  durationMinutes: number;
  tags: string[];
  educatorId: string;
  watchPercentage: number;
  releaseDate: string; // ISO 8601 format: "YYYY-MM-DD"
  viewCount: number;
}

export interface Category {
  id: string;
  title:string;
  content: ContentItem[];
}

export interface Educator {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
}

export interface Reply {
  id: string;
  author: string;
  avatarUrl: string;
  text: string;
  likes: number;
  timestamp: string; // ISO 8601
}

export interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  text: string;
  likes: number;
  timestamp: string; // ISO 8601
  replies: Reply[];
}

export interface ShortItem {
  id: string;
  videoUrl: string;
  posterUrl: string;
  title: string;
  description: string;
  educatorId: string;
  likes: number;
  commentsCount: number;
  comments: Comment[];
}

export interface NoteItem {
  id: string;
  title: string;
  description: string; // Can contain HTML for links
  thumbnailUrl: string;
  documentUrl: string; // URL to the actual PDF/document
  isSaved: boolean;
  authorId: string;
  category: string;
  publishDate: string; // ISO 8601
}

export interface ChartItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // URL to the actual image file
  isSaved: boolean;
  authorId: string;
  category: string;
  publishDate: string; // ISO 8601
}

export interface MessageItem {
  id: string;
  authorId: string;
  content: string; // Can contain HTML for links
  timestamp: string; // ISO 8601
}

export type Page = 'home' | 'videos' | 'shorts' | 'notes' | 'charts' | 'dr-ram' | 'admin-update' | 'my-list' | 'profile' | 'settings' | 'faq' | 'terms' | 'privacy' | 'help';