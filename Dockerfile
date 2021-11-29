FROM arm32v7/node
WORKDIR /app

COPY package.json ./
RUN npm install
COPY ./app.js ./app.js
COPY ./public/ ./public/
COPY ./src/ ./src/

CMD ["npm", "start"]