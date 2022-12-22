export class TweetHelper {
  static async tweetCursorPaginator(db: any, cursor: number | null, query: object) {
    if (cursor == null) {
      return await db.tweet.findMany({
        take: 10,
        ...query,
      });
    } else {
      return await db.tweet.findMany({
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