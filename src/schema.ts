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
    """Search users"""
    searchUsers(
        filter: FilterUsers!,
        """Pagination by cursor, get users after X user ID"""
        cursor: Int
    ): [User]
    """Get user by ID"""
    userById(userId: Int!): User
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
    """Search tweets"""
    searchTweets(
        filter: FilterTweets!,
        """Pagination by cursor, get users after X user ID"""
        cursor: Int
    ): [Tweet]
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
}

"""Authentication payload"""
type AuthPayload {
    """JWT Token, put it in your Authorization header"""
    token: String!
    """Your user"""
    user: User!
}

"""Input to filter users"""
input FilterUsers {
    """Filter users by username"""
    username: String
}

"""Input to filter tweets"""
input FilterTweets {
    """Filter tweets by content"""
    body: String
}
`;