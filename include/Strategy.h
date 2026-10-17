#ifndef STRATEGY_H
#define STRATEGY_H

#include <vector>
#include "MarketMaker.h"

class Strategy {
public:
static std::vector<TradingResult> runFixedSpread(
const std::vector<MarketEvent>& events,
double spread,
int maxInventory
);


static std::vector<TradingResult> runInventoryAware(
    const std::vector<MarketEvent>& events,
    double spread,
    int maxInventory
);


};

#endif
