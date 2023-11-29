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
    userByUsername: UserQueries.getByUsername,
    followers: UserQueries.queryFollowers,
    following: UserQueries.queryFollowing,
    followersYouMayKnow: UserQueries.queryFollowersYouMayKnow,
  },
  TweetQueries: {
    index: TweetQueries.index,
    searchTweets: TweetQueries.query,
    tweetById: TweetQueries.tweetById,
    tweetComments: TweetQueries.getComments,
    queryUserTweets: TweetQueries.queryUserTweets,
    indexUserTweets: TweetQueries.indexUserTweets,
    getUserRetweets: TweetQueries.getUserRetweets,
    getUserHearts: TweetQueries.getUserHearts,
    getTweetsHearts: TweetQueries.getTweetsHearts,
    getTweetsRetweets: TweetQueries.getTweetsRetweets,
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
    isFollowingYou: UserQueries.isFollowingYou,
    isFollowedByYou: UserQueries.isFollowedByYou,
  },
  Tweet: {
    comments: TweetQueries.countComments,
    retweets: TweetQueries.countRetweets,
    hearts: TweetQueries.countHearts,
    parent: TweetQueries.getParent,
    author: TweetQueries.getAuthor,
    isHeartedByYou: TweetQueries.isHeartedByYou,
    isRetweetedByYou: TweetQueries.isRetweetedByYou,
  },
  Date: DateScalar,
};