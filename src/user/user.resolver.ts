import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql/error/index.js";
import { UserValidator } from "./user.validator.js";
import * as bcrypt from "bcrypt";
import { JwtGenerator } from "../jwt/jwt-generator.js";
import { JwtValidator } from "../jwt/jwt-validator.js";

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
      const user = await db.user.create({
        data: {
          username: username,
          password: hash,
        },
      });
      return {
        token: JwtGenerator(user.id, username),
        user: user,
      };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          throw new GraphQLError("Username already taken");
        }
      }
      console.error(e);
      throw new GraphQLError("Something bad happen, please try again.");
    }
  }

  static async login(_: any, args: any, { db }: any) {
    const { username, password } = args;
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    if (user != null) {
      if (await bcrypt.compare(password, user.password)) {
        return {
          token: JwtGenerator(user.id, username),
          user: user,
        };
      }
    }
    throw new GraphQLError("Invalid Credentials");
  }

  static async profile(_: any, __: any, { db, token }: any) {
    if (token != "") {
      return await JwtValidator(token, db);
    }
    throw new GraphQLError("Unauthenticated: You have to login to do this.");
  }

  static async delete(_: any, args: any, { db, token }: any) {
    if (token != "") {
      const user = await JwtValidator(token, db);
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          deleted: new Date(),
        },
      });
      return `${user.username} was deleted`;
    }
    throw new GraphQLError("Unauthenticated: You have to login to do this.");
  }
}