# Build
FROM node:22 as build

WORKDIR /usr/src/app
COPY package*.json .
RUN npm install 

COPY . .

RUN npm run build

# Production
FROM node:22 as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/package-lock.json ./package-lock.json

RUN npm install --only=production

EXPOSE 6379

CMD ["node", "build/index.js"]
