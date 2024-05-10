# Dockerfile

# Base image
FROM node:21.6.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Expose the app's port
EXPOSE 3000

# Start the app
CMD [ "yarn", "start:dev" ]