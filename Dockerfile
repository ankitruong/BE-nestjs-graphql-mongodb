#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:14.5.0 as builder
ENV NPM_CONFIG_LOGLEVEL info

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm install --quiet && npm run build

# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:14.5.0-alpine as production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm install --production --quiet

## We just need the build to execute the command
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
 
CMD npm run start:prod