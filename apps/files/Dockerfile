FROM node:20.11-alpine
ARG port
ARG service
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

# Generate migrations (if needed)
RUN npm run migrate:add

# Run migrations before building the application
RUN npm run migrate:deploy

# Build the application for the specified service
RUN npm run build:${SERVICE}

# Bind to all network interfaces so that it can be mapped to the host OS

EXPOSE ${PORT}

CMD npm run 'start:files'
