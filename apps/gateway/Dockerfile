# Check out https://hub.docker.com/_/node to select a new base image
FROM node:20.11-alpine
ARG port
ARG service
ARG database_url
ARG shadow_database_url
ENV SERVICE=$service
ENV PORT=$port
ENV DATABASE_URL=$database_url
ENV SHADOW_DATABASE_URL=$shadow_database_url
# Set to a non-root built-in user `node`

USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/dist/${SERVICE}

WORKDIR /home/node/dist/${SERVICE}

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)



COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

# Генерация клиента Prisma перед сборкой
RUN npx prisma generate
RUN npx prisma generate --schema=apps/gateway/prisma/schema.prisma

RUN npm run build:${SERVICE}


# Bind to all network interfaces so that it can be mapped to the host OS

EXPOSE ${PORT}

CMD npm run migrate:add && npm run migrate:deploy && npm run start:gateway

