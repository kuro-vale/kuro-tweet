export const Schema = `#graphql
scalar Date

type User {
    id: ID
    username: String
    joined: Date
    deleted: Date
}

type Query {
    users: [User]
}
`;