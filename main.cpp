#include <iostream>
#include <cstdlib>

#include "MarketSimulator.h"
#include "Strategy.h"
#include "Results.h"
#include "CSVExporter.h"

using namespace std;

int main() {
    srand(42);

    int steps;
    int maxInventory;

    double initialCash = 100000;
    double spread = 2;

    cout << "=============================\n";
    cout << "        TradeSim\n";
    cout << "=============================\n";

    cout << "Enter simulation steps: ";
    cin >> steps;

    cout << "Enter maximum inventory: ";
    cin >> maxInventory;

    if (steps <= 0 || maxInventory <= 0) {
        cout << "Please enter positive values.\n";
        return 1;
    }

    MarketSimulator market;

    vector<MarketEvent> events = market.generateMarket(steps);

    StrategyResult fixed = Strategy::run(
        events,
        "Fixed Spread",
        false,
        initialCash,
        spread,
        maxInventory
    );

    StrategyResult smart = Strategy::run(
        events,
        "Inventory-Aware",
        true,
        initialCash,
        spread,
        maxInventory
    );

    int choice;

    do {
        cout << "\n========== MENU ==========\n";
        cout << "1. Fixed Spread Results\n";
        cout << "2. Inventory-Aware Results\n";
        cout << "3. Compare Strategies\n";
        cout << "4. Export Fixed Spread Results\n";
        cout << "5. Export Inventory-Aware Results\n";
        cout << "0. Exit\n";

        cout << "Enter choice: ";
        cin >> choice;

        if (choice == 1) {
            displayResults(fixed);
        }
        else if (choice == 2) {
            displayResults(smart);
        }
        else if (choice == 3) {
            compareStrategies(fixed, smart);
        }
        else if (choice == 4) {
            if (exportToCSV(fixed, "results/fixed_spread.csv")) {
                cout << "Results exported successfully.\n";
            }
            else {
                cout << "Could not create file. Check the results folder.\n";
            }
        }
        else if (choice == 5) {
            if (exportToCSV(smart, "results/inventory_aware.csv")) {
                cout << "Results exported successfully.\n";
            }
            else {
                cout << "Could not create file. Check the results folder.\n";
            }
        }
        else if (choice != 0) {
            cout << "Invalid choice.\n";
        }

    } while (choice != 0);

    cout << "Thank you for using TradeSim!\n";

    return 0;
}