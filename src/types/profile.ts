import { ReactNode } from "react";

export interface UserData {
  nama: string;
  email: string;
  nohandphone: string;
  password: string;
  alamat: string;
  profilePicture: string;
}

export interface FormFieldProps {
  icon: ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
