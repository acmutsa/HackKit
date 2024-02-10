# Use the base image with Alpine
FROM alpine:3.14 AS build

# Set working directory
WORKDIR /root

# Add the edge community repository where newer Node.js versions might be found
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories

# Install Node.js and npm from the edge repository
RUN apk add --update --no-cache nodejs-current npm

# Copy your application files
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Install dependencies and build your application
RUN npm install
RUN npm run build
RUN npm prune --production

# Start a new stage from scratch for a lighter image
FROM alpine:3.14

WORKDIR /root

# Copy the built application and node_modules from the previous stage
COPY --from=build /root/node_modules ./node_modules
COPY --from=build /root/dist ./dist

# Install Node.js, npm, and PostgreSQL client in the final image
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories
RUN apk add --update --no-cache postgresql-client nodejs-current npm

# Set the entry point to your application
ENTRYPOINT ["node", "dist/index.js"]
