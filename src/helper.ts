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

  static metadataAssembler(count: number, per: number, page: number) {
    const lastPage = Math.ceil(count / per);
    const hasPrevious = page > 1 && page <= lastPage;
    const hasNext = page >= 1 && page < lastPage;
    return {
      per: per,
      total: count,
      current: page,
      previous: hasPrevious ? page - 1 : null,
      next: hasNext ? page + 1 : null,
      first: 1,
      last: lastPage,
    };
  }
}