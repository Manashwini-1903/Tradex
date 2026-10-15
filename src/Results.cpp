#include "Results.h"
#include <iostream>
#include <iomanip>

using namespace std;

void displayResults(StrategyResult result) {
    cout << "\nStrategy: " << result.name << endl;

    cout << fixed << setprecision(2);

    cout << "Final Profit/Loss: "
         << result.finalProfitLoss << endl;

    cout << "Final Inventory: "
         << result.finalInventory << endl;

    cout << "Total Trades: "
         << result.trades << endl;
}

void compareStrategies(StrategyResult first, StrategyResult second) {
    cout << "\n------ Strategy Comparison ------\n";

    cout << left << setw(25) << "Strategy"
         << setw(20) << "Profit/Loss" << endl;

    cout << left << setw(25) << first.name
         << setw(20) << first.finalProfitLoss << endl;

    cout << left << setw(25) << second.name
         << setw(20) << second.finalProfitLoss << endl;

    cout << "---------------------------------\n";
}