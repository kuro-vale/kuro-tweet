import { DateScalar } from "./scalars/date.scalar.js";
import { UserQueries } from "./user/resolvers/user.queries.js";
import { UserMutations } from "./user/resolvers/user.mutations.js";
import { TweetQueries } from "./tweet/resolvers/tweet.queries.js";
import { TweetMutations } from "./tweet/resolvers/tweet.mutations.js";

export const Resolvers = {
  Query: {
    UserQueries: () => "",
    TweetQueries: () => "",
  },
  UserQueries: {
    profile: UserQueries.profile,
    searchUsers: UserQueries.query,
    userById: UserQueries.getByID,
    followers: UserQueries.queryFollowers,
    following: UserQueries.queryFollowing,
    followersYouMayKnow: UserQueries.queryFollowersYouMayKnow,
  },
  TweetQueries: {
    searchTweets: TweetQueries.query,
  },
  Mutation: {
    Auth: () => "",
    UserOps: () => "",
    TweetOps: () => "",
  },
  Auth: {
    register: UserMutations.register,
    login: UserMutations.login,
  },
  UserOps: {
    deleteUser: UserMutations.delete,
    follow: UserMutations.follow,
    unfollow: UserMutations.unFollow,
  },
  TweetOps: {
    compose: TweetMutations.compose,
    comment: TweetMutations.comment,
    deleteTweet: TweetMutations.deleteTweet,
    retweet: TweetMutations.retweet,
    unRetweet: TweetMutations.unRetweet,
    heart: TweetMutations.heart,
    unHeart: TweetMutations.unHeart,
  },
  User: {
    tweets: UserQueries.countTweets,
    hearts: UserQueries.countHearts,
    followers: UserQueries.countFollowers,
    following: UserQueries.countFollowing,
  },
  Tweet: {
    comments: TweetQueries.countComments,
    retweets: TweetQueries.countRetweets,
    hearts: TweetQueries.countHearts,
    parent: TweetQueries.getParent,
    author: TweetQueries.getAuthor,
  },
  Date: DateScalar,
};