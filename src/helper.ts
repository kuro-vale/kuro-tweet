import { GraphQLError } from "graphql/error/index.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index.js";

export class Helper {
  static LoginMessage = "Unauthenticated: You have to login to do this.";

  static catchDBErrors(e: any, message: string) {
    if (e instanceof PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          throw new GraphQLError(message);
        case "P2025":
          throw new GraphQLError(message);
        case "P2003":
          throw new GraphQLError(message);
        default:
          console.error(e);
          throw new GraphQLError("Well, this never happen before, please try again");
      }
    }
    console.error(e);
    throw new GraphQLError("Something bad happen, please try again.");
  }
}