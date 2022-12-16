import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql/error/index.js";

export class Helper {
  static catchDBErrors(e: any, message: string) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          throw new GraphQLError(message);
        case "P2025":
          throw new GraphQLError(message);
        default:
          throw new GraphQLError("Well, this never happen before, please try again");
      }
    }
    console.error(e);
    throw new GraphQLError("Something bad happen, please try again.");
  }
}