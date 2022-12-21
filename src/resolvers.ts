import { DateScalar } from "./scalars/date.scalar.js";
import { UserResolver } from "./user/user.resolver.js";
import { TweetResolver } from "./tweet/tweet.resolver.js";

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
    TweetOps: () => "",
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
  TweetOps: {
    compose: TweetResolver.compose,
    deleteTweet: TweetResolver.deleteTweet,
    retweet: TweetResolver.retweet,
    unRetweet: TweetResolver.unRetweet,
    heart: TweetResolver.heart,
    unHeart: TweetResolver.unHeart,
  },
  User: {
    tweets: UserResolver.countTweets,
    hearts: UserResolver.countHearts,
    followers: UserResolver.countFollowers,
    following: UserResolver.countFollowing,
  },
  Tweet: {
    comments: TweetResolver.countComments,
    retweets: TweetResolver.countRetweets,
    hearts: TweetResolver.countHearts,
  },
  Date: DateScalar,
};