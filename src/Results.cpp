
#include "../include/Results.h"

#include <iostream>
#include <iomanip>

void Results::printSummary(
    const std::vector<TradingResult>& results,
    const char* strategyName
) {
    std::cout << "\n========================================\n";
    std::cout << "          " << strategyName << "\n";
    std::cout << "========================================\n";

    if (results.empty()) {
        std::cout << "No simulation results available.\n";
        return;
    }

    const TradingResult& finalResult = results.back();

    std::cout << std::fixed << std::setprecision(2);

    std::cout << "Final Market Price : "
              << finalResult.marketPrice << '\n';

    std::cout << "Final P&L          : "
              << finalResult.profitLoss << '\n';

    std::cout << "Final Inventory    : "
              << finalResult.inventory << '\n';

    std::cout << "Final Cash         : "
              << finalResult.cash << '\n';

    std::cout << "Total Trades       : "
              << finalResult.trades << '\n';

    std::cout << "Performance        : ";

    if (finalResult.profitLoss > 0.0) {
        std::cout << "PROFIT\n";
    }
    else if (finalResult.profitLoss < 0.0) {
        std::cout << "LOSS\n";
    }
    else {
        std::cout << "BREAK EVEN\n";
    }

    std::cout << "========================================\n";
}

