import type User from "@/app/types/User";
export default interface Comment {
  content: string;
  createdAt: string;
  user: User;
}
