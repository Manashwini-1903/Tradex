# TradeSim — Market-Making Simulator

## About the Project

TradeSim is a C++ command-line project that simulates a simplified market-making environment. It compares two strategies: Fixed Spread and Inventory-Aware.

## Features

* Random market price generation
* Simulated buy and sell orders
* Two market-making strategies
* Cash and inventory tracking
* Profit and loss calculation
* Strategy comparison
* CSV export for further analysis

## Technologies Used

* C++17
* STL vectors
* Classes and objects
* Random number generation
* File handling

## How to Compile

Open the terminal in the main TradeSim folder and run:

```bash
g++ -std=c++17 -Iinclude main.cpp src/MarketSimulator.cpp src/MarketMaker.cpp src/Strategy.cpp src/Results.cpp src/CSVExporter.cpp -o tradesim
```

## How to Run

On Windows PowerShell:

```powershell
.\tradesim.exe
```

## Limitations

This project uses a simplified market model. Order execution and inventory management do not fully represent a real financial market. The results are for educational purposes only.
