export interface User {
  _id: string;
  email: string;
  password: string;
  nama: string;
  nohandphone: string;
  alamat?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

// For registration/update without sensitive fields
export interface UserInput {
  email: string;
  password: string;
  nama: string;
  nohandphone: string;
  alamat?: string;
  profilePicture?: string;
}

// For public profile data without sensitive information
export interface PublicUser {
  _id: string;
  nama: string;
  email: string;
  nohandphone: string;
  alamat?: string;
  profilePicture?: string;
}

// For auth responses
export interface AuthResponse {
  success: boolean;
  user: PublicUser;
  token?: string;
  error?: string;
}

// For comparing passwords
export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = User & UserMethods;
