#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:14.5.0 as builder
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm install --quiet && npm run build

EXPOSE 3000
 
CMD npm run start:prod