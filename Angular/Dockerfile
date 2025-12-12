FROM node:alpine

WORKDIR /usr/src/app

# Build argument for API URL from .env
ARG API_URL=http://localhost:3001

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

# Inject API_URL into config.ts before serving
RUN sed -i "s|http://localhost:3001|${API_URL}|g" apps/biblio-app/src/app/core/config/config.ts

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
