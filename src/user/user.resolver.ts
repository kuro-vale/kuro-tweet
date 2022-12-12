import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql/error/index.js";

export class UserResolver {
  static async query(_: any, __: any, { db }: any) {
    return await db.user.findMany();
  }

  static async register(_: any, args: any, { db }: any) {
    const { username, password } = args;
    try {
      return await db.user.create({
        data: {
          username: username,
          password: password,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          throw new GraphQLError("Username already taken");
        }
      }
      throw new GraphQLError("Something bad happen, please try again.");
    }
  }
}