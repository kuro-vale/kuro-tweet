import { UserHelper } from "../user.helper.js";
import { GraphQLError } from "graphql/error/index.js";
import { Helper } from "../../helper.js";

export class UserQueries {
  static async query(_: any, { filter }: any, { db }: any) {
    return db.user.findMany({
      take: 10,
      where: {
        username: {
          contains: filter.username,
          mode: "insensitive",
        },
        deleted: null,
      },
      orderBy: {
        followedBy: {
          _count: "desc",
        },
      },
    });
  }

  static async getByID(_: any, { userId }: any, { db }: any) {
    return await db.user.findFirst({
      where: {
        id: userId,
        deleted: null,
      },
    });
  }

  static async queryFollowers(_: any, { userId, cursor }: any, { db }: any) {
    const query = {
      where: {
        deleted: null,
        following: {
          some: {
            followingId: userId,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    };
    return UserHelper.userCursorPaginator(db, cursor, query);
  }

  static async queryFollowing(_: any, { userId, cursor }: any, { db }: any) {
    const query = {
      where: {
        deleted: null,
        followedBy: {
          some: {
            followerId: userId,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    };
    return UserHelper.userCursorPaginator(db, cursor, query);
  }

  static async queryFollowersYouMayKnow(_: any, { userId, cursor }: any, { db, user }: any) {
    if (user != null) {
      const query = {
        where: {
          deleted: null,
          following: {
            some: {
              followingId: userId,
            },
          },
          followedBy: {
            some: {
              followerId: user.id,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      };
      return UserHelper.userCursorPaginator(db, cursor, query);
    }
    throw new GraphQLError(Helper.LoginMessage);
  }

  static async profile(_: any, __: any, { user }: any) {
    if (user != null) {
      return user;
    }
    throw new GraphQLError(Helper.LoginMessage);
  }

  static async countTweets(parent: any, __: any, { db }: any) {
    return await db.tweet.count({
      where: {
        authorId: parent.id,
      },
    });
  }

  static async countHearts(parent: any, __: any, { db }: any) {
    return await db.heart.count({
      where: {
        byId: parent.id,
      },
    });
  }

  static async countFollowers(parent: any, __: any, { db }: any) {
    return await db.follows.count({
      where: {
        followingId: parent.id,
      },
    });
  }

  static async countFollowing(parent: any, __: any, { db }: any) {
    return await db.follows.count({
      where: {
        followerId: parent.id,
      },
    });
  }
}