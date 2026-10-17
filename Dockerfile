FROM node:24-bookworm-slim

WORKDIR /app

# Install the C++ compiler

RUN apt-get update && apt-get install -y --no-install-recommends g++ 
&& rm -rf /var/lib/apt/lists/*

# Install Node.js dependencies

COPY package*.json ./
RUN npm ci --omit=dev

# Copy the project files

COPY . .

# Compile the C++ simulator for Linux

RUN g++ -std=c++17 -Iinclude 
src/main.cpp 
src/MarketSimulator.cpp 
src/MarketMaker.cpp 
src/Strategy.cpp 
src/Results.cpp 
src/CSVExporter.cpp 
-o TradeX 
&& chmod +x TradeX 
&& mkdir -p data

# Start the Node.js server

CMD ["node", "server.js"]
