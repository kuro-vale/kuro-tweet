import { TweetHelper } from "../tweet.helper.js";

export class TweetQueries {
  static async query(_: any, { cursor, filter }: any, { db }: any) {
    filter = {
      where: {
        body: {
          contains: filter.body,
          mode: "insensitive",
        },
        deleted: null,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        author: true,
      },
    };
    return await TweetHelper.tweetCursorPaginator(db, cursor, filter);
  }

  static async tweetById(_: any, { tweetId }: any, { db }: any) {
    return await db.tweet.findFirst({
      where: {
        id: tweetId,
        deleted: null,
      },
    });
  }

  static async getParent(parent: any, __: any, { db }: any) {
    if (parent.parentId == null) return null;
    return await db.tweet.findFirst({
      where: {
        id: parent.parentId,
        deleted: null,
      },
    });
  }

  static async getAuthor(parent: any, __: any, { db }: any) {
    if (parent.author != null) return parent.author;
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