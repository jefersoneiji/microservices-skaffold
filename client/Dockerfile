FROM node:alpine

# ENV CI=true
# ENV WDS_SOCKET_PORT=0

EXPOSE 5173

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY ./ ./

CMD ["yarn", "dev"]