import "next-auth";
import { type DefaultSession } from "next-auth";
import "next-auth/jwt";
import { User as PrismaUser } from "../generated/prisma";

export declare module "next-auth" {
  type User = PrismaUser;

  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string;
    email: string;
  }
}
