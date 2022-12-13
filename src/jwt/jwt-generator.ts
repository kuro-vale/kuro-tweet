import jwt from "jsonwebtoken";


export function JwtGenerator(id: number, username: string): string {
  return jwt.sign({ id: id }, process.env["JWT_SECRET"] || "secret", {
    algorithm: "HS256",
    expiresIn: "15 days",
    subject: username,
  });
}