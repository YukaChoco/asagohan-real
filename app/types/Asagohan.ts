import type User from "@/app/types/User";
import type Comment from "@/app/types/Comment";

export default interface Asagohan {
  id: string;
  createdAt: string;
  title: string;
  imagePath: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  user: User;
  ranking: number | null;
}

export interface UserBestAsagohan {
  id: string;
  imagePath: string;
}

export interface UserThisWeekAsagohan {
  createdAt: string;
  imagePath: string;
}

export interface RankingAsagohan {
  title: string;
  imagePath: string;
  likes: number;
  user: User;
  ranking: number;
}
