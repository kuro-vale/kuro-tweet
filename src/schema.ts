export const Schema = `#graphql
scalar Date

type User {
    id: ID
    username: String
    joined: Date
}

type AuthPayload {
    token: String!
    user: User!
}

type Query {
    profile: User
    users: [User]
}

type Mutation {
    register(username: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
    delete_user: String
}
`;