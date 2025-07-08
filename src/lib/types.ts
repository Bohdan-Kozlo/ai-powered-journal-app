export interface UserCreateInput {
  email: string;
  fullName: string;
  clerkId: string;
  imageUrl?: string;
}

export interface UserUpdateInput {
  email?: string;
  fullName?: string;
  imageUrl?: string | null;
}

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
  data?: Record<string, unknown>;
};
