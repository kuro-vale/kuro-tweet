export class TweetHelper {
  static async tweetCursorPaginator(db: any, cursor: number | null, query: object) {
    if (cursor == null) {
      return await db.tweet.findMany({
        take: 10,
        orderBy: {
          id: "desc",
        },
        include: {
          author: true,
        },
        ...query,
      });
    } else {
      return await db.tweet.findMany({
        take: 10,
        skip: 1,
        cursor: {
          id: cursor,
        },
        orderBy: {
          id: "desc",
        },
        include: {
          author: true,
        },
        ...query,
      });
    }
  }
}