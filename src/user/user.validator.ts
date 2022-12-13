import { object, string, ValidationError } from "yup";
import { GraphQLError } from "graphql/error/index.js";

export async function UserValidator(username: string, password: string) {
  const userSchema = object({
    username: string().min(4, "Username must have more than 3 characters")
      .max(28, "Username must have less than 3 characters")
      .matches(/^(?!.*\.\.)(?!.*\.$)\w[\w.-]+$/,
        "Username can only have letters, numbers and '_' '.' '-'"),
    password: string().min(5, "Password must have more than 4 characters"),
  });
  try {
    await userSchema.validate({ username, password });
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new GraphQLError(e.errors.toString());
    }
  }
}