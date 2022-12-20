import { object, string, ValidationError } from "yup";
import { GraphQLError } from "graphql/error/index.js";

export async function TweetValidator(body: string) {
  const tweetSchema = object({
    body: string().required().max(255, "Tweets can have only 255 characters"),
  });
  try {
    await tweetSchema.validate({ body });
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new GraphQLError(e.errors.toString());
    }
  }
}