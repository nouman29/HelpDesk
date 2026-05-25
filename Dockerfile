# Bumped from Node 18 to Node 22 to satisfy Vite's requirements
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port your Vite dev server runs on (usually 5173)
EXPOSE 5173

# Start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]