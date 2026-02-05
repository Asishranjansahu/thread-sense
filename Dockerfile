# Build Stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDeps for Vite build)
RUN npm install

# Copy source code
COPY . .

# Build the frontend
# This generates the /dist folder that the server will serve
RUN npm run build

# Expose API Port
EXPOSE 5050

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/index.js"]
