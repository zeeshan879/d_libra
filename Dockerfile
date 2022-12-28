FROM node:17.7.2-slim

LABEL name="Node Express Application" \   
     maintainer="Ali Kahoot <kahoot.ali@outlook.com>" \
     summary="A Node Express application"

# Create app directory
WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app

# Expose port
EXPOSE 3000


# Run app
CMD [ "npm", "start" ]