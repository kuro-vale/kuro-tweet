export const Schema = `#graphql
scalar Date

type Query {
    """Retrieve logged user"""
    profile: User
    """Retrieve all user"""
    users: [User]
}

type Mutation

extend type Mutation {
    """Auth mutations"""
    Auth: Auth
}

"""Auth mutations"""
type Auth {
    """Create a new user an generate a token"""
    register(username: String!, password: String!): AuthPayload
    """Generate a new token"""
    login(username: String!, password: String!): AuthPayload
    """Delete logged user"""
    deleteUser: String
    """Follow a user"""
    follow(followId: Int!): String
    """Unfollow a user"""
    unfollow(unFollowId: Int!): String
}

"""
Type used for authentication
"""
type User {
    """"ID of the user"""
    id: ID
    """Username of the user, this field must be unique"""
    username: String
    """Date of registration"""
    joined: Date
    """User that are following this user"""
    followers: [User]
    """Users this user is following"""
    following: [User]
}

"""Authentication payload"""
type AuthPayload {
    """JWT Token, put it in your Authorization header"""
    token: String!
    """Your user"""
    user: User!
}
`;