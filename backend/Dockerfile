FROM node:22.14.0-alpine

RUN corepack enable pnpm

WORKDIR /usr/src/app

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm exec prisma generate

RUN ls -la node_modules/.prisma/client/

EXPOSE 4000

CMD ["node", "dist/main.js"]