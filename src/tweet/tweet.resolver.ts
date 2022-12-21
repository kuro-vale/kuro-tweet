import { GraphQLError } from "graphql/error/index.js";
import { TweetValidator } from "./tweet.validator.js";
import { Helper } from "../helper.js";


const LoginMessage = "Unauthenticated: You have to login to do this.";

export class TweetResolver {
  static async compose(_: any, { body }: any, { db, user }: any) {
    if (user != null) {
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

  static async deleteTweet(_: any, { tweetId }: any, { db, user }: any) {
    if (user != null) {
      const tweet = await db.tweet.findUnique({ where: { id: tweetId } });
      if (tweet != null && user.id == tweet.authorId) {
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

  static async retweet(_: any, { tweetId }: any, { db, user }: any) {
    if (user != null) {
      try {
        await db.retweet.upsert({
          where: {
            byId_tweetId: {
              tweetId: tweetId,
              byId: user.id,
            },
          },
          update: {
            retweetedAt: new Date(),
          },
          create: {
            tweetId: tweetId,
            byId: user.id,
          },
        });
      } catch (e) {
        Helper.catchDBErrors(e, "Cannot retweet a tweet that don't exists");
      }
      return "Success";
    }
    throw new GraphQLError(LoginMessage);
  }

  static async unRetweet(_: any, { tweetId }: any, { db, user }: any) {
    if (user != null) {
      try {
        await db.retweet.delete({
          where: {
            byId_tweetId: {
              tweetId: tweetId, byId: user.id,
            },
          },
        });
      } catch (e) {
        Helper.catchDBErrors(e, "Cannot undo a retweet of a tweet that you don't retweeted");
      }
      return "Success";
    }
    throw new GraphQLError(LoginMessage);
  }
}