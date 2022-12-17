export const Schema = `#graphql
scalar Date

type Query {
    """Retrieve logged user"""
    profile: User
    """Retrieve all user"""
    users(page: Int, filter: FilterUsers): UserPagination
    """Get user by ID"""
    userById(userId: Int!): User
}

type Mutation

extend type Mutation {
    """Auth mutations"""
    Auth: Auth
    """User Mutations"""
    UserOps: UserOps
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

"""Metadata for pagination"""
type PaginationMetadata {
    """Max elements in the page"""
    per: Int
    """Total elements"""
    total: Int
    """Current page"""
    current: Int
    """Previous page"""
    previous: Int
    """Next page"""
    next: Int
    """First page"""
    first: Int
    """Last page"""
    last: Int
}

"""Return metadata and users"""
type UserPagination {
    """Pagination Metadata"""
    metadata: PaginationMetadata
    """All users retrieved"""
    data: [User]
}

input FilterUsers {
    username: String
}
`;