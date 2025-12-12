FROM node:alpine

WORKDIR /usr/src/app

# Build argument for API URL from .env
ARG API_URL=http://localhost:3001

COPY . /usr/src/app

RUN npm install

# Inject API_URL into config.js before serving
RUN sed -i "s|http://localhost:3001|${API_URL}|g" src/config/config.js

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
