import { GraphQLError } from "graphql/error/index.js";
import { UserValidator } from "./user.validator.js";
import * as bcrypt from "bcrypt";
import { JwtGenerator } from "../jwt/jwt-generator.js";
import { Helper } from "../helper.js";
import { UserHelper } from "./user.helper.js";

const LoginMessage = "Unauthenticated: You have to login to do this.";

export class UserResolver {
  static async query(_: any, { cursor, filter }: any, { db }: any) {
    filter = {
      where: {
        username: {
          contains: filter.username,
          mode: "insensitive",
        },
        deleted: null,
      }
    };
    return UserHelper.userCursorPaginator(db, cursor, filter);
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
    throw new GraphQLError(LoginMessage);
  }

  static async register(_: any, args: any, { db }: any) {
    const { username, password } = args;
    await UserValidator(username, password);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    try {
      const user = await db.user.create({
        data: {
          username: username,
          password: hash,
        },
      });
      return {
        token: JwtGenerator(user.id, username),
        user: user,
      };
    } catch (e) {
      Helper.catchDBErrors(e, "Username already taken");
    }
  }

  static async login(_: any, args: any, { db }: any) {
    const { username, password } = args;
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    if (user != null) {
      if (await bcrypt.compare(password, user.password)) {
        return {
          token: JwtGenerator(user.id, username),
          user: user,
        };
      }
    }
    throw new GraphQLError("Invalid Credentials");
  }

  static async profile(_: any, __: any, { user }: any) {
    if (user != null) {
      return user;
    }
    throw new GraphQLError(LoginMessage);
  }

  static async delete(_: any, args: any, { db, user }: any) {
    if (user != null) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          deleted: new Date(),
        },
      });
      await db.tweet.updateMany({
        where: {
          authorId: user.id,
        },
        data: {
          deleted: new Date(),
        },
      });
      return `${user.username} was deleted`;
    }
    throw new GraphQLError(LoginMessage);
  }

  static async follow(_: any, { followId }: any, { db, user }: any) {
    if (user != null) {
      if (user.id == followId) {
        throw new GraphQLError("Forbidden: You can't follow yourself");
      }
      try {
        await db.follows.create({
          data: {
            followerId: user.id,
            followingId: followId,
          },
        });
      } catch (e) {
        Helper.catchDBErrors(e, "You already follow this person");
      }
      return "Success";
    }
    throw new GraphQLError(LoginMessage);
  }

  static async unFollow(_: any, { unFollowId }: any, { db, user }: any) {
    if (user != null) {
      try {
        await db.follows.delete({
          where: {
            followerId_followingId: {
              followerId: user.id,
              followingId: unFollowId,
            },
          },
        });
      } catch (e) {
        Helper.catchDBErrors(e, "You can't unfollow someone who you don't follow");
      }
      return "Success";
    }
    throw new GraphQLError(LoginMessage);
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