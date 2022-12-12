export class UserResolver {
  static async query(_: any, __: any, { db }: any) {
    return await db.user.findMany();
  }
}