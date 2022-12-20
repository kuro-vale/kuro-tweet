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
}