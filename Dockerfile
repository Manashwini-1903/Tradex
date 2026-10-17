FROM node:24-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN g++ -std=c++17 -Iinclude src/main.cpp src/MarketSimulator.cpp src/MarketMaker.cpp src/Strategy.cpp src/Results.cpp src/CSVExporter.cpp -o TradeX && chmod +x TradeX && mkdir -p data

CMD ["node", "server.js"]
