import { UserValidator } from "../user.validator.js";
import * as bcrypt from "bcrypt";
import { JwtGenerator } from "../../jwt/jwt-generator.js";
import { Helper } from "../../helper.js";
import { GraphQLError } from "graphql/error/index.js";

export class UserMutations {
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
    throw new GraphQLError(Helper.LoginMessage);
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
    throw new GraphQLError(Helper.LoginMessage);
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
    throw new GraphQLError(Helper.LoginMessage);
  }
}