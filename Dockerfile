FROM node:22.14.0
WORKDIR /usr/local/app
COPY package*.json ./
RUN npm ci --include=prod
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "npx prisma generate && npm run build && npm run start"]
