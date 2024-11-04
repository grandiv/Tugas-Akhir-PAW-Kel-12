import jwt from "jsonwebtoken";
// import User from "@/models/User";

export const createToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

// export const login = async (email: string, password: string) => {
//   // TODO
// };

// export const register = async (userData: any) => {
//   // TODO
// };
