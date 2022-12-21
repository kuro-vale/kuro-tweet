import jwt from "jsonwebtoken";

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
    return null;
  }
}