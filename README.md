# TradeX — Market Making Simulator

TradeX is an educational market-making simulator built using **C++17, Node.js, and JavaScript**. It simulates market activity and compares two market-making strategies through an interactive web dashboard.

**Live Demo:** https://tradex-ihs1.onrender.com
**GitHub Repository:** https://github.com/Manashwini-1903/Tradex

## Features

* Simulates market activity and order execution.
* Compares Fixed Spread and Inventory-Aware strategies.
* Displays market prices, bid-ask spreads, inventory, and profit/loss.
* Visualizes market price movements using interactive charts.
* Provides trade history and CSV export for analyzing results.
* Offers a web-based interface for running simulations.

## Tech Stack

* **C++17** — Market simulation and trading strategies
* **Node.js & Express** — Backend API
* **HTML, CSS & JavaScript** — Frontend
* **Chart.js** — Data visualization
* **Docker & Render** — Deployment

## Run Locally

### Prerequisites

* Node.js and npm
* A C++ compiler supporting C++17

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Manashwini-1903/Tradex.git
   cd Tradex
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser.

The application compiles and runs the C++ simulator through its backend, so a compatible C++ compiler must be installed.

## Strategies

**Fixed Spread:** Uses a fixed bid-ask spread around the market price.

**Inventory-Aware:** Adjusts quoted prices based on current inventory to manage inventory exposure.

## Purpose

This project explores market-making concepts, trading strategies, inventory management, and the integration of C++ with a web-based application.

*TradeX is an educational simulator. It does not execute real trades or provide financial advice.*
