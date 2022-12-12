import { DateScalar } from "./scalars/date.scalar.js";

export const Resolvers = {
  Query: {
    "users": async (_: any, __: any, { db }: any) => await db.user.findMany(),
  },
  Date: DateScalar,
};