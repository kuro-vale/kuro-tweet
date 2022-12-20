import { GraphQLError } from "graphql/error/index.js";
import { JwtValidator } from "../jwt/jwt-validator.js";
import { TweetValidator } from "./tweet.validator.js";


const LoginMessage = "Unauthenticated: You have to login to do this.";

export class TweetResolver {
  static async compose(_: any, { body }: any, { db, token }: any) {
    if (token != "") {
      const user = await JwtValidator(token, db);
      await TweetValidator(body);
      return await db.tweet.create({
        data: {
          body: body,
          authorId: user.id,
        },
        include: {
          author: true,
        },
      });
    }
    throw new GraphQLError(LoginMessage);
  }

  static async deleteTweet(_: any, { tweetId }: any, { db, token }: any) {
    if (token != "") {
      const user = await JwtValidator(token, db);
      const tweet = await db.tweet.findUnique({ where: { id: tweetId } });
      if (user.id == tweet.authorId) {
        if (tweet.deleted == null) {
          await db.tweet.update({
            where: {
              id: tweetId,
            },
            data: {
              deleted: new Date(),
            },
          });
          return "Success";
        }
        throw new GraphQLError("This tweet was already deleted");
      }
      throw new GraphQLError("Forbidden");
    }
    throw new GraphQLError(LoginMessage);
  }
}