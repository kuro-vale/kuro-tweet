# kuro-tweet

[![PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/kuro-vale/kuro-tweet/main/pwd-stack.yml)

Welcome to kuro-tweet, a clone of the Twitter API built using GraphQL and Apollo Server. With this API, you can perform actions seen on Twitter, such as post tweets and interacting with them with retweets and hearts.
You can also have an Index where you see the latest tweets of the users you follow.

### Features
- Uses Prisma as a data modeling and type-safe database client
- Integrated GraphQL playground to make queries and mutations
- JWT for token authentication
- Bcrypt to encrypt users' passwords
- Cursor-based pagination for scalable queries and infinite-scrolls
- Yup for data validation

## Deploy

Follow any of these methods and open http://localhost:4000/ to see the GraphQL playground.

### Docker

Run the command below to quickly deploy this project on your machine, see the [docker image](https://hub.docker.com/r/kurovale/kuro-tweet) for more info.

```bash
docker run -d -p 4000:4000 kurovale/kuro-tweet:sqlite
```

### Quick Setup

1. Create a .env file, use .env.example as reference
2. Run npm install
3. Run npx prisma generate
4. Run npx prisma migrate deploy 
5. Run npm start
