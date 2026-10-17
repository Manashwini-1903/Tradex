
#include <iostream>
#include <vector>
#include <limits>

#include "../include/MarketSimulator.h"
#include "../include/Strategy.h"
#include "../include/Results.h"
#include "../include/CSVExporter.h"

int main() {

    int steps;
    int maxInventory;
    double spread;

    std::cout << "====================================\n";
    std::cout << "          TradeX Simulator\n";
    std::cout << "====================================\n";

    std::cout << "Enter number of simulation steps: ";
    if (!(std::cin >> steps)) {
        std::cout << "Invalid input. Enter a whole number.\n";
        return 1;
    }

    std::cout << "Enter maximum inventory: ";
    if (!(std::cin >> maxInventory)) {
        std::cout << "Invalid input. Enter a whole number.\n";
        return 1;
    }

    std::cout << "Enter bid-ask spread: ";
    if (!(std::cin >> spread)) {
        std::cout << "Invalid input. Enter a number.\n";
        return 1;
    }

    if (steps <= 0 || maxInventory <= 0 || spread <= 0) {
        std::cout << "\nInvalid input. All values must be positive.\n";
        return 1;
    }

    unsigned int seed;

std::cout << "Enter random seed: ";

if (!(std::cin >> seed)) {
    std::cout << "Invalid seed. Enter a whole number.\n";
    return 1;
}

MarketSimulator simulator(100.0, seed);

    std::vector<MarketEvent> events =
        simulator.generateEvents(steps);

    std::vector<TradingResult> fixedResults =
        Strategy::runFixedSpread(events, spread, maxInventory);

    std::vector<TradingResult> smartResults =
        Strategy::runInventoryAware(events, spread, maxInventory);

    Results::printSummary(fixedResults, "Fixed Spread");

    Results::printSummary(smartResults, "Inventory Aware");

    if (CSVExporter::exportResults(
            "data/results.csv",
            fixedResults,
            smartResults)) {
        std::cout << "\nResults exported to data/results.csv\n";
    } else {
        std::cout << "\nCould not export CSV. Check the data folder.\n";
    }

    std::cout << "\nSimulation completed successfully!\n";

    return 0;
}

