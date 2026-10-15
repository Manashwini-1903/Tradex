#ifndef MARKETSIMULATOR_H
#define MARKETSIMULATOR_H

#include <vector>

using namespace std;

struct MarketEvent {
    double price;
    int orderType;
};

class MarketSimulator {
public:
    vector<MarketEvent> generateMarket(int steps);
};

#endif