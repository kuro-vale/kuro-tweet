import { GraphQLError } from "graphql/error/index.js";
import { UserValidator } from "./user.validator.js";
import * as bcrypt from "bcrypt";
import { JwtGenerator } from "../jwt/jwt-generator.js";
import { JwtValidator } from "../jwt/jwt-validator.js";
import { UserHelper } from "./user.helper.js";

const LoginMessage = "Unauthenticated: You have to login to do this.";

export class UserResolver {
  static async query(_: any, __: any, { db }: any) {
    return await db.user.findMany();
  }

  static async query_followers(parent: any, __: any, { db }: any) {
    const followers = await db.user.findUnique({
      where: {
        username: parent.username,
      },
    }).followedBy({
      include: {
        follower: true,
      },
    });
    let response = [];
    for (const follower of followers) {
      response.push(follower.follower);
    }
    return response;
  }

  static async query_following(parent: any, __: any, { db }: any) {
    const followings = await db.user.findUnique({
      where: {
        username: parent.username,
      },
    }).following({
      include: {
        following: true,
      },
    });
    let response = [];
    for (const following of followings) {
      response.push(following.following);
    }
    return response;
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
      UserHelper.catchDBErrors(e, "Username already taken");
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

  static async profile(_: any, __: any, { db, token }: any) {
    if (token != "") {
      return await JwtValidator(token, db);
    }
    throw new GraphQLError(LoginMessage);
  }

  static async delete(_: any, args: any, { db, token }: any) {
    if (token != "") {
      const user = await JwtValidator(token, db);
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          deleted: new Date(),
        },
      });
      return `${user.username} was deleted`;
    }
    throw new GraphQLError(LoginMessage);
  }

  static async follow(_: any, args: any, { db, token }: any) {
    const { followId } = args;
    if (token != "") {
      const user = await JwtValidator(token, db);
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
        UserHelper.catchDBErrors(e, "You already follow this person");
      }
      return "Success";
    }
    throw new GraphQLError(LoginMessage);
  }

  static async unFollow(_: any, args: any, { db, token }: any) {
    const { unFollowId } = args;
    if (token != "") {
      const user = await JwtValidator(token, db);
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
        UserHelper.catchDBErrors(e, "You can't unfollow someone who you don't follow");
      }
      return "Success";
    }
    throw new GraphQLError(LoginMessage);
  }
}