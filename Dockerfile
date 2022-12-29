FROM node:18-alpine3.16 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run compile
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine3.16
EXPOSE 4000

COPY prisma .
COPY package.json .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN npx prisma generate

COPY docker-entrypoint.sh .
CMD [ "sh", "docker-entrypoint.sh" ]