export class UserHelper {
  static async userCursorPaginator(db: any, cursor: number | null, query: object) {
    if (cursor == null) {
      return await db.user.findMany({
        take: 10,
        ...query,
      });
    } else {
      return await db.user.findMany({
        take: 10,
        skip: 1,
        cursor: {
          id: cursor,
        },
        ...query,
      });
    }
  }
}