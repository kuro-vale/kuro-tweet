#!/bin/sh
npx prisma migrate deploy;
node dist/index.js;
