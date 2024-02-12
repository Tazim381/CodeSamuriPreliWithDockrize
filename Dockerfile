FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Install nodemon globally
RUN npm install -g nodemon

EXPOSE 8000

CMD ["nodemon", "server.js"]
