import { TweetHelper } from "../tweet.helper.js";
import { UserHelper } from "../../user/user.helper.js";
import { GraphQLError } from "graphql/error/index.js";
import { Helper } from "../../helper.js";

export class TweetQueries {

  static async index(_: any, { cursor }: any, { db, user }: any) {
    if (user != null) {
      let followingsIds = await db.follows.findMany({
        select: {
          followingId: true,
        },
        where: {
          followerId: user.id,
        },
      });
      followingsIds = followingsIds.map((i: any) => i.followingId);
      let query = {
        where: {
          authorId: {
            in: followingsIds,
          },
          deleted: null,
        },
      };
      return TweetHelper.tweetCursorPaginator(db, cursor, query);
    }
    throw new GraphQLError(Helper.LoginMessage);
  }

  static async query(_: any, { cursor, filter }: any, { db }: any) {
    filter = {
      where: {
        body: {
          contains: filter.body,
          mode: "insensitive",
        },
        deleted: null,
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
      include: {
        author: true,
      },
    });
  }

  static async getComments(_: any, { tweetId, cursor }: any, { db }: any) {
    const mostHearted = await db.tweet.findMany({
      take: 10,
      where: {
        parentId: tweetId,
        deleted: null,
      },
      orderBy: {
        heartBy: {
          _count: "desc",
        },
      },
      include: {
        author: true,
      },
    });
    const mostHeartedIds = [];
    for (const tweet of mostHearted) {
      mostHeartedIds.push(tweet.id);
    }
    const query = {
      where: {
        id: {
          notIn: mostHeartedIds,
        },
        parentId: tweetId,
        deleted: null,
      },
    };
    const firstCursor = await db.tweet.findFirst({ ...query });
    mostHearted.push(firstCursor);
    if (cursor == null) {
      return mostHearted;
    }
    return await db.tweet.findMany({
      take: 10,
      skip: 1,
      cursor: {
        id: cursor,
      },
      ...query,
    });
  }

  static async queryUserTweets(_: any, { cursor, filter, userId }: any, { db }: any) {
    if (filter == null) filter = { body: "" };
    filter = {
      where: {
        body: {
          contains: filter.body,
          mode: "insensitive",
        },
        authorId: userId,
        deleted: null,
      },
    };
    return await TweetHelper.tweetCursorPaginator(db, cursor, filter);
  }

  static async indexUserTweets(_: any, { cursor, userId }: any, { db }: any) {
    const query = {
      where: {
        parentId: null,
        authorId: userId,
        deleted: null,
      },
    };
    return await TweetHelper.tweetCursorPaginator(db, cursor, query);
  }

  static async getUserRetweets(_: any, { cursor, userId }: any, { db }: any) {
    let tweetsIds = [];
    const query = {
      where: {
        byId: userId,
      },
      take: 10,
      orderBy: {
        id: "desc",
      },
    };
    let retweets;
    if (cursor == null) {
      retweets = await db.retweet.findMany(query);
    } else {
      retweets = await db.retweet.findMany({
        ...query,
        skip: 1,
        cursor: {
          id: cursor,
        },
      });
    }
    for (let retweet of retweets) {
      tweetsIds.push(retweet.tweetId);
    }
    let tweets = await db.tweet.findMany({
      where: {
        id: {
          in: tweetsIds,
        },
        deleted: null,
      },
      include: {
        author: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    let response = [];
    for (let i = 0; i < tweets.length; i++) {
      response.push({
        tweet: tweets[i],
        cursorId: retweets[i].id,
      });
    }
    return response;
  }

  static async getUserHearts(_: any, { cursor, userId }: any, { db }: any) {
    let tweetsIds = [];
    const query = {
      where: {
        byId: userId,
      },
      take: 10,
      orderBy: {
        id: "desc",
      },
    };
    let tweets;
    if (cursor == null) {
      tweets = await db.heart.findMany(query);
    } else {
      tweets = await db.heart.findMany({
        ...query,
        skip: 1,
        cursor: {
          id: cursor,
        },
      });
    }
    for (let tweet of tweets) {
      tweetsIds.push(tweet.tweetId);
    }
    let hearts = await db.tweet.findMany({
      where: {
        id: {
          in: tweetsIds,
        },
        deleted: null,
      },
      include: {
        author: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    let response = [];
    for (let i = 0; i < hearts.length; i++) {
      response.push({
        tweet: hearts[i],
        cursorId: tweets[i].id,
      });
    }
    return response;
  }

  static async getTweetsRetweets(_: any, { cursor, tweetId }: any, { db }: any) {
    let query = {
      where: {
        retweets: {
          some: {
            tweetId: tweetId,
          },
        },
        deleted: null,
      },
    };
    return await UserHelper.userCursorPaginator(db, cursor, query);
  }

  static async getTweetsHearts(_: any, { cursor, tweetId }: any, { db }: any) {
    let query = {
      where: {
        hearts: {
          some: {
            tweetId: tweetId,
          },
        },
        deleted: null,
      },
    };
    return await UserHelper.userCursorPaginator(db, cursor, query);
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

  static async isHeartedByYou(parent: any, __: any, { db, user }: any) {
    if (user != null) {
      const hearted = await db.heart.findFirst({
        where: {
          tweetId: parent.id,
          byId: user.id,
        },
      });
      if (hearted != null) return true;
    }
    return false;
  }

  static async isRetweetedByYou(parent: any, __: any, { db, user }: any) {
    if (user != null) {
      const retweeted = await db.retweet.findFirst({
        where: {
          tweetId: parent.id,
          byId: user.id,
        },
      });
      if (retweeted != null) return true;
    }
    return false;
  }
}