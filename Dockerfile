# base image
FROM node:20-alpine
# work dir all subsequent entries will be from /app
WORKDIR /app
# only package files first
COPY package.json package-lock.json ./
# it will cache the layers and only will run if above file changes
RUN npm ci --production
# copy all files except mentioned in .dockerignore
COPY . .
# install deps
# start command
CMD ["node", "./cron.js"]