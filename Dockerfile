FROM node:16.15
WORKDIR /app/server
COPY ./package.json ./
RUN npm install
RUN npm i https
COPY . .
CMD ['npm','run', 'devStart']
