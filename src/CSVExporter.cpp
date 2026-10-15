#include "CSVExporter.h"
#include <fstream>

using namespace std;

bool exportToCSV(StrategyResult result, string filename) {
    ofstream file(filename);

    if (!file.is_open()) {
        return false;
    }

    file << "Step,MarketPrice,BidPrice,AskPrice,"
            "Inventory,ProfitLoss\n";

    for (int i = 0; i < result.records.size(); i++) {
        file << result.records[i].step << ","
             << result.records[i].marketPrice << ","
             << result.records[i].bidPrice << ","
             << result.records[i].askPrice << ","
             << result.records[i].inventory << ","
             << result.records[i].profitLoss << "\n";
    }

    file.close();

    return true;
}