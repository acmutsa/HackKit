# Build stage with official Node.js base image
FROM node:20.11.1-alpine3.14 AS build

WORKDIR /root

# Copy the application files
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Install npm dependencies and build your app
RUN npm install
RUN npm run build
RUN npm prune --production

# Final stage with Alpine base image
FROM alpine:3.14

WORKDIR /root

# Install runtime dependencies
RUN apk add --update --no-cache curl postgresql-client

# Copy Node.js from the build stage
COPY --from=build /usr/local/bin/node /usr/local/bin/node
COPY --from=build /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=build /root/node_modules ./node_modules
COPY --from=build /root/dist ./dist

# Ensure node command is available
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs

ENTRYPOINT ["node", "dist/index.js"]