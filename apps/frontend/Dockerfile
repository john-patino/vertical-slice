FROM node:22-alpine
WORKDIR /app

# Dependencias en una capa propia para aprovechar la caché de Docker.
COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

EXPOSE 5173
CMD ["npm", "run", "dev"]
