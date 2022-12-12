import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Schema } from "./schema.js";
import { Resolvers } from "./resolvers.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: Schema,
  resolvers: Resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({
    db: prisma,
  }),
});

console.log(`🚀  Server ready at: ${url}`);