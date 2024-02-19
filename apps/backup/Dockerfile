# Build stage
FROM alpine:3.14 AS build

# Install dependencies required for Node.js installation
RUN apk add --update --no-cache curl alpine-sdk python3

WORKDIR /root

# Download and install Node.js LTS (20.11.1)
RUN cd /tmp && \
    curl -fsSLO --compressed "https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64-musl.tar.xz" && \
    tar -xJf "node-v20.11.1-linux-x64-musl.tar.xz" -C /usr/local --strip-components=1 --no-same-owner && \
    ln -s /usr/local/bin/node /usr/local/bin/nodejs && \
    node -v && \
    npm -v

# Copy the application files
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Install npm dependencies and build your app
RUN npm install
RUN npm run build
RUN npm prune --production

# Final stage
FROM alpine:3.14

WORKDIR /root

# Install dependencies required for Node.js and runtime dependencies
RUN apk add --update --no-cache curl postgresql-client alpine-sdk python3

# Repeat the Node.js installation for the runtime environment
RUN cd /tmp && \
    curl -fsSLO --compressed "https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64-musl.tar.xz" && \
    tar -xJf "node-v20.11.1-linux-x64-musl.tar.xz" -C /usr/local --strip-components=1 --no-same-owner && \
    ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Copy the node_modules and build directories from the build stage
COPY --from=build /root/node_modules ./node_modules
COPY --from=build /root/dist ./dist

ENTRYPOINT ["node", "dist/index.js"]
