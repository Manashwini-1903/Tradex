#ifndef MARKET_SIMULATOR_H
#define MARKET_SIMULATOR_H

#include <vector>
#include <random>

struct MarketEvent {
int step;
double price;
int orderType;
};

class MarketSimulator {
private:
double startingPrice;
std::mt19937 generator;

public:
MarketSimulator(double price, unsigned int seed);


std::vector<MarketEvent> generateEvents(int steps);


};

#endif
