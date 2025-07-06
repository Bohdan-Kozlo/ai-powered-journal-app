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
