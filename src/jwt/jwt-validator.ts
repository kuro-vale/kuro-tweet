import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql/error/index.js";


export async function JwtValidator(token: string, db: any) {
  try {
    const decode = jwt.verify(token, process.env["JWT_SECRET"] || "secret");
    return await db.user.findFirstOrThrow({
      where: {
        username: decode.sub,
        deleted: null,
      },
    });
  } catch (e) {
    throw new GraphQLError("Unauthenticated: Invalid Token");
  }
}