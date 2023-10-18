# Use an official Node.js image as the base image
FROM node:current-alpine3.14

# Create a non-root user to run the application

# Set the working directory and copy application files
WORKDIR /home/app
COPY . .

# Install dependencies
RUN yarn install

# Change ownership of the application files to the non-root user
RUN chown -R node:node /home/app

# Switch to the non-root user
USER node

# Specify the command to start your application
CMD ["yarn", "start:dev"]
