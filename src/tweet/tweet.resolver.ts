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
      });
    }
    throw new GraphQLError(LoginMessage);
  }

  static async comment(_: any, { body, tweetId }: any, { db, user }: any) {
    if (user != null) {
      await TweetValidator(body);
      return await db.tweet.create({
        data: {
          body: body,
          authorId: user.id,
          parentId: tweetId,
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
        return "Success";
      } catch (e) {
        Helper.catchDBErrors(e, "Cannot retweet a tweet that don't exists");
      }
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
        return "Success";
      } catch (e) {
        Helper.catchDBErrors(e, "Cannot undo a retweet of a tweet that you don't retweeted");
      }
    }
    throw new GraphQLError(LoginMessage);
  }

  static async heart(_: any, { tweetId }: any, { db, user }: any) {
    if (user != null) {
      try {
        await db.heart.upsert({
          where: {
            byId_tweetId: {
              byId: user.id,
              tweetId: tweetId,
            },
          },
          update: {
            createdAt: new Date(),
          },
          create: {
            byId: user.id,
            tweetId: tweetId,
          },
        });
        return "Success";
      } catch (e) {
        Helper.catchDBErrors(e, "Cannot heart a tweet that don't exists");
      }
    }
    throw new GraphQLError(LoginMessage);
  }

  static async unHeart(_: any, { tweetId }: any, { db, user }: any) {
    if (user != null) {
      try {
        await db.heart.delete({
          where: {
            byId_tweetId: {
              tweetId: tweetId, byId: user.id,
            },
          },
        });
        return "Success";
      } catch (e) {
        Helper.catchDBErrors(e, "Cannot undo a heart of a tweet that you don't liked");
      }
    }
    throw new GraphQLError(LoginMessage);
  }

  static async getParent(parent: any, __: any, { db }: any) {
    return await db.tweet.findFirst({
      where: {
        id: parent.parentId,
        deleted: null,
      },
    });
  }

  static async getAuthor(parent: any, __: any, { db }: any) {
    return await db.user.findFirst({
      where: {
        id: parent.authorId,
        deleted: null,
      },
    });
  }

  static async countComments(parent: any, __: any, { db }: any) {
    return await db.tweet.count({
      where: {
        parentId: parent.id,
      },
    });
  }

  static async countRetweets(parent: any, __: any, { db }: any) {
    return await db.retweet.count({
      where: {
        tweetId: parent.id,
      },
    });
  }

  static async countHearts(parent: any, __: any, { db }: any) {
    return await db.heart.count({
      where: {
        tweetId: parent.id,
      },
    });
  }
}