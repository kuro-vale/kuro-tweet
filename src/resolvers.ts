import { DateScalar } from "./scalars/date.scalar.js";
import { UserResolver } from "./user/user.resolver.js";

export const Resolvers = {
  Query: {
    "users": UserResolver.query,
  },
  Mutation: {
    "register": UserResolver.register,
  },
  Date: DateScalar,
};