import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Schema } from "./schema.js";
import { Resolvers } from "./resolvers.js";
import { PrismaClient } from "@prisma/client";
import { JwtValidator } from "./jwt/jwt-validator.js";
import depthLimit from "graphql-depth-limit";

const prisma = new PrismaClient();

prisma.$use(async (params: any, next: any) => {
  if (params.model == "Retweet") {
    if (params.action == "upsert") {
      const maxId = await prisma.retweet.findFirst({
        select: {
          id: true
        },
        orderBy: {
          id: 'desc'
        }
      })
      if (maxId) {
        params.args.create.id = maxId.id + 1;
      } else {
        params.args.create.id = 1;
      }
    }
  }
  if (params.model == "Heart") {
    if (params.action == "upsert") {
      const maxId = await prisma.heart.findFirst({
        select: {
          id: true
        },
        orderBy: {
          id: 'desc'
        }
      })
      if (maxId) {
        params.args.create.id = maxId.id + 1;
      } else {
        params.args.create.id = 1;
      }
    }
  }
  return next(params);
});

const server = new ApolloServer({
  typeDefs: Schema,
  resolvers: Resolvers,
  validationRules: [depthLimit(4)],
  includeStacktraceInErrorResponses: false,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: parseInt(process.env["PORT"] || "4000") },
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