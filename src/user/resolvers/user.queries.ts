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

  static async getByUsername(_: any, { username }: any, { db }: any) {
    return await db.user.findFirst({
      where: {
        username: username,
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
        deleted: null,
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

  static async isFollowingYou(parent: any, __: any, { db, user }: any) {
    if (user != null) {
      const following = await db.follows.findFirst({
        where: {
          followerId: parent.id,
          followingId: user.id,
        },
      });
      if (following != null) return true;
    }
    return false;
  }

  static async isFollowedByYou(parent: any, __: any, { db, user }: any) {
    if (user != null) {
      const following = await db.follows.findFirst({
        where: {
          followerId: user.id,
          followingId: parent.id,
        },
      });
      if (following != null) return true;
    }
    return false;
  }
}