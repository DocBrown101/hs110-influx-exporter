FROM node:lts-alpine
ADD . /app
WORKDIR /app
RUN npm i
CMD node -r esm src/app.js
