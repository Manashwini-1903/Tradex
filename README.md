# TradeX

### Market Making Simulator

TradeX is a simple project that helps people understand how market making works.

It lets users simulate a market, try two different trading strategies, and compare their results using charts and performance summaries.

**No real money or real trades are involved.**

## Features

* **Run Simulations:** Choose your settings and simulate market activity.
* **Compare Strategies:** See how Fixed Spread and Inventory Aware strategies perform.
* **View Charts:** Compare the profit and loss (P&L) of both strategies.
* **Explore Trade History:** View past simulation results and filter them by strategy or trade action.
* **Download Results:** Export simulation data as a CSV file for further analysis.

## Built With

* C++ — Runs the market simulation.
* HTML and CSS — Build the website's layout and design.
* JavaScript — Makes the website interactive.
* Node.js and Express — Connect the website to the C++ simulator.
* Chart.js — Displays charts.

## How to Run

To run TradeX on your computer, you need **C++ (GCC), Node.js, and npm** installed.

**1. Download the project**

Download the repository from GitHub and extract it, or clone it using Git.

**2. Open the project folder**

Open the main TradeX folder in VS Code.

**3. Install the required packages**

Open the terminal in the main project folder and run:

```bash
npm install
```

**4. Compile the C++ program**

Run this command in the same terminal:

```bash
g++ -std=c++17 -Iinclude src/main.cpp src/MarketSimulator.cpp src/MarketMaker.cpp src/Strategy.cpp src/Results.cpp src/CSVExporter.cpp -o TradeX.exe
```

**5. Start the website**

Run:

```bash
node server.js
```

**6. Open TradeX**

Visit this address in your browser:

`http://localhost:3000`

Keep the terminal running while using the websi
