import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Schema } from "./schema.js";
import { Resolvers } from "./resolvers.js";
import { PrismaClient } from "@prisma/client";
import depthLimit from "graphql-depth-limit";

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: Schema,
  resolvers: Resolvers,
  validationRules: [depthLimit(3)],
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    return {
      db: prisma,
      token: token,
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);