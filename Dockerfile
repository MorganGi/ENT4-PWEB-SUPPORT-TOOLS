FROM node:16.15
WORKDIR /app/server
COPY ./package.json ./
RUN npm install
COPY . .
CMD ['npm','run', 'devStart']