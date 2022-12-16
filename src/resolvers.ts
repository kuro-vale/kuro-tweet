import { DateScalar } from "./scalars/date.scalar.js";
import { UserResolver } from "./user/user.resolver.js";

export const Resolvers = {
  Query: {
    profile: UserResolver.profile,
    users: UserResolver.query,
  },
  User: {
    followers: UserResolver.query_followers,
    following: UserResolver.query_following,
  },
  Mutation: {
    Auth: () => "",
  },
  Auth: {
    register: UserResolver.register,
    login: UserResolver.login,
    deleteUser: UserResolver.delete,
    follow: UserResolver.follow,
    unfollow: UserResolver.unFollow,
  },
  Date: DateScalar,
};