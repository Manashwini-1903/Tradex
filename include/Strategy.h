#ifndef STRATEGY_H
#define STRATEGY_H

#include "MarketSimulator.h"
#include <string>
#include <vector>

using namespace std;

struct SimulationRecord {
    int step;
    double marketPrice;
    double bidPrice;
    double askPrice;
    int inventory;
    double profitLoss;
};

struct StrategyResult {
    string name;
    double finalProfitLoss;
    int finalInventory;
    int trades;

    vector<SimulationRecord> records;
};

class Strategy {
public:
    static StrategyResult run(
        vector<MarketEvent> events,
        string name,
        bool inventoryAware,
        double initialCash,
        double spread,
        int maxInventory
    );
};

#endif