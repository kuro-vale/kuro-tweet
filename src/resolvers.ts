import { DateScalar } from "./scalars/date.scalar.js";
import { UserResolver } from "./user/user.resolver.js";

export const Resolvers = {
  Query: {
    "profile": UserResolver.profile,
    "users": UserResolver.query,
  },
  Mutation: {
    "Auth": () => "",
  },
  Auth: {
    "register": UserResolver.register,
    "login": UserResolver.login,
    "deleteUser": UserResolver.delete,
  },
  Date: DateScalar,
};