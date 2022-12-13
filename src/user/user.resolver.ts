import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql/error/index.js";
import { UserValidator } from "./user.validator.js";
import * as bcrypt from "bcrypt";

export class UserResolver {
  static async query(_: any, __: any, { db }: any) {
    return await db.user.findMany();
  }

  static async register(_: any, args: any, { db }: any) {
    const { username, password } = args;
    await UserValidator(username, password);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    try {
      return await db.user.create({
        data: {
          username: username,
          password: hash,
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