#ifndef MARKET_SIMULATOR_H
#define MARKET_SIMULATOR_H

#include <vector>

struct MarketEvent {
    int step;
    double price;
    int orderType;
};

class MarketSimulator {
private:
    double startingPrice;

public:
    MarketSimulator(double price);

    std::vector<MarketEvent> generateEvents(int steps);
};

#endif