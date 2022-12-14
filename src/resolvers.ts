import { DateScalar } from "./scalars/date.scalar.js";
import { UserResolver } from "./user/user.resolver.js";

export const Resolvers = {
  Query: {
    "profile": UserResolver.profile,
    "users": UserResolver.query,
  },
  Mutation: {
    "register": UserResolver.register,
    "login": UserResolver.login,
    "delete_user": UserResolver.delete,
  },
  Date: DateScalar,
};