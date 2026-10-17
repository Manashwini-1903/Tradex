#ifndef RESULTS_H
#define RESULTS_H

#include <vector>
#include "MarketMaker.h"

class Results {
public:
static void printSummary(
const std::vector<TradingResult>& results,
const char* strategyName
);
};

#endif
