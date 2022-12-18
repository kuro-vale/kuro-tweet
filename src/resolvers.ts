import { DateScalar } from "./scalars/date.scalar.js";
import { UserResolver } from "./user/user.resolver.js";

export const Resolvers = {
  Query: {
    UserQueries: () => "",
  },
  UserQueries: {
    profile: UserResolver.profile,
    searchUsers: UserResolver.query,
    userById: UserResolver.getByID,
    followers: UserResolver.queryFollowers,
    following: UserResolver.queryFollowing,
    followersYouMayKnow: UserResolver.queryFollowersYouMayKnow,
  },
  Mutation: {
    Auth: () => "",
    UserOps: () => "",
  },
  Auth: {
    register: UserResolver.register,
    login: UserResolver.login,
  },
  UserOps: {
    deleteUser: UserResolver.delete,
    follow: UserResolver.follow,
    unfollow: UserResolver.unFollow,
  },
  Date: DateScalar,
};