import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Schema } from "./schema.js";
import { Resolvers } from "./resolvers.js";
import { PrismaClient } from "@prisma/client";
import { JwtValidator } from "./jwt/jwt-validator.js";

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: Schema,
  resolvers: Resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    let user = null;
    if (token != "") {
      user = await JwtValidator(token, prisma);
    }
    return {
      db: prisma,
      user: user,
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);