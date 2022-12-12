import { GraphQLScalarType } from "graphql";

export const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: any) {
    value = new Date(value);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return value.toLocaleDateString("en-US", options);
  },
});