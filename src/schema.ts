export const Schema = `#graphql
scalar Date

type Query

extend type Query {
    """User Queries"""
    UserQueries: UserQueries
    """Tweet  Queries"""
    TweetQueries: TweetQueries
}

type Mutation

extend type Mutation {
    """Auth mutations"""
    Auth: Auth
    """User Mutations"""
    UserOps: UserOps
    """Tweet mutations"""
    TweetOps: TweetOps
}

"""Auth mutations"""
type Auth {
    """Create a new user an generate a token"""
    register(username: String!, password: String!): AuthPayload
    """Generate a new token"""
    login(username: String!, password: String!): AuthPayload
}

"""User Mutations"""
type UserOps {
    """Delete your user"""
    deleteUser: String
    """Follow a user"""
    follow(followId: Int!): String
    """Unfollow a user"""
    unfollow(unFollowId: Int!): String
}

"""Tweet mutations"""
type TweetOps {
    """Create a new tweet"""
    compose(body: String!): Tweet
    """Compose a comment"""
    comment(body: String!, tweetId: Int!): Tweet
    """Delete a tweet"""
    deleteTweet(tweetId: Int!): String
    """Retweet a tweet"""
    retweet(tweetId: Int!): String
    """Undo Retweet"""
    unRetweet(tweetId: Int!): String
    """Like a tweet"""
    heart(tweetId: Int!): String
    """Unlike a tweet"""
    unHeart(tweetId: Int!): String
}

"""UserQueries"""
type UserQueries {
    """Get logged user"""
    profile: User
    """Search 10 most followed users"""
    searchUsers(filter: FilterUsers!): [User]
    """Get user by username"""
    userByUsername(username: String!): User
    """Get users that follow X user"""
    followers(
        userId: Int!,
        """Pagination by cursor, get users after X user ID"""
        cursor: Int
    ): [User]
    """Get users that X user follows"""
    following(
        userId: Int!,
        """Pagination by cursor, get users after X user ID"""
        cursor: Int
    ): [User]
    """Get followers of X user that you follow"""
    followersYouMayKnow(
        userId: Int!,
        """Pagination by cursor, get users after X user ID"""
        cursor: Int
    ): [User]
}

"""Tweet Queries"""
type TweetQueries {
    """Get recent tweets of users you are following"""
    index(
        """Pagination by cursor, get tweets after X tweet ID"""
        cursor: Int
    ): [Tweet]
    """Search tweets"""
    searchTweets(
        filter: FilterTweets!,
        """Pagination by cursor, get tweets after X tweet ID"""
        cursor: Int
    ): [Tweet]
    """Get tweet by id"""
    tweetById(tweetId: Int!): Tweet
    """Get tweet comments"""
    tweetComments(
        tweetId: Int!
        """Pagination by cursor, get tweets after X tweet ID"""
        cursor: Int
    ): [Tweet]
    """Query user's tweets"""
    queryUserTweets(
        userId: Int!,
        filter: FilterTweets,
        """Pagination by cursor, get tweets after X tweet ID"""
        cursor: Int
    ): [Tweet]
    """Get only tweets of an user that are not responses"""
    indexUserTweets(
        userId: Int!,
        """Pagination by cursor, get tweets after X tweet ID"""
        cursor: Int
    ): [Tweet]
    """Get user's retweets"""
    getUserRetweets(
        userId: Int!,
        """Pagination by cursor, get retweets after X retweet ID"""
        cursor: Int
    ): [CursorTweet]
    """Get user's tweets hearted"""
    getUserHearts(
        userId: Int!,
        """Pagination by cursor, get tweets after X tweet ID"""
        cursor: Int
    ): [CursorTweet]
    """Get users that hearted this tweet"""
    getTweetsHearts(
        tweetId: Int!,
        """Pagination by cursor, get tweets after X tweet ID"""
        cursor: Int
    ): [User]
    """Get users that retweeted this tweet"""
    getTweetsRetweets(
        tweetId: Int!,
        """Pagination by cursor, get tweets after X tweet ID"""
        cursor: Int
    ): [User]
}

"""Type used for authentication"""
type User {
    """"ID of the user"""
    id: Int
    """Username of the user, this field must be unique"""
    username: String
    """Date of registration"""
    joined: Date
    """Amount of tweets of this user"""
    tweets: Int
    """Amount of tweets this user likes"""
    hearts: Int
    """Amount of user followers"""
    followers: Int
    """Amount of user following"""
    following: Int
    """True if this user follows you"""
    isFollowingYou: Boolean
    """True if you are following this user"""
    isFollowedByYou: Boolean
}

"""The main type of this app LMAO"""
type Tweet {
    """ID of the tweet"""
    id: Int
    """Content of the tweet"""
    body: String
    """Writer of the tweet"""
    author: User
    """Amount of responses of this tweet"""
    comments: Int
    """Amount of users who retweeted this"""
    retweets: Int
    """Amount of users who liked this"""
    hearts: Int
    """If this tweet is a response to another tweet, show its parent"""
    parent: Tweet
    """Null if tweet is not a response to another tweet"""
    parentId: Int
    """Date of creation"""
    createdAt: Date
    """True if you already hearted this tweet"""
    isHeartedByYou: Boolean
    """True if you already retweeted this tweet"""
    isRetweetedByYou: Boolean
}

"""Authentication payload"""
type AuthPayload {
    """JWT Token, put it in your Authorization header"""
    token: String!
    """Your user"""
    user: User!
}

"""Retweets and Hearts use a different Id for cursor pagination"""
type CursorTweet {
    tweet: Tweet
    cursorId: Int
}

"""Input to filter users"""
input FilterUsers {
    """Filter users by username"""
    username: String!
}

"""Input to filter tweets"""
input FilterTweets {
    """Filter tweets by content"""
    body: String!
}
`;