
#include "../include/CSVExporter.h"

#include <fstream>
#include <iomanip>

bool CSVExporter::exportResults(
    const std::string& filename,
    const std::vector<TradingResult>& fixedResults,
    const std::vector<TradingResult>& smartResults
) {
    std::ofstream file(filename);

    if (!file.is_open()) {
        return false;
    }

    file << std::fixed << std::setprecision(2);

    // Write all 11 CSV columns.
    file << "Step,Strategy,MarketPrice,BidPrice,AskPrice,"
         << "Inventory,Cash,ProfitLoss,Trades,"
         << "TradeAction,ExecutionPrice\n";

    // Export Fixed Spread strategy results.
    for (const TradingResult& result : fixedResults) {
        file << result.step << ","
             << "Fixed Spread" << ","
             << result.marketPrice << ","
             << result.bidPrice << ","
             << result.askPrice << ","
             << result.inventory << ","
             << result.cash << ","
             << result.profitLoss << ","
             << result.trades << ","
             << result.tradeAction << ","
             << result.executionPrice << "\n";
    }

    // Export Inventory Aware strategy results.
    for (const TradingResult& result : smartResults) {
        file << result.step << ","
             << "Inventory Aware" << ","
             << result.marketPrice << ","
             << result.bidPrice << ","
             << result.askPrice << ","
             << result.inventory << ","
             << result.cash << ","
             << result.profitLoss << ","
             << result.trades << ","
             << result.tradeAction << ","
             << result.executionPrice << "\n";
    }

    file.close();

    return !file.fail();
}

