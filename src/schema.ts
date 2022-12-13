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
    users: [User]
}

type Mutation {
    register(username: String!, password: String!): AuthPayload
}
`;