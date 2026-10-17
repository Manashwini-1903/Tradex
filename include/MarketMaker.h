
#ifndef MARKET_MAKER_H
#define MARKET_MAKER_H
#include <string>
#include "MarketSimulator.h"

struct TradingResult {
int step;
double marketPrice;
double bidPrice;
double askPrice;


int inventory;
double cash;
double profitLoss;
int trades;

// Details of the current simulation step
std::string tradeAction;
double executionPrice;


};

class MarketMaker {
private:
double spread;
int maxInventory;
double cash;
int inventory;
int trades;
bool inventoryAware;

public:
MarketMaker(
double spread,
int maxInventory,
bool inventoryAware = false
);


TradingResult processEvent(const MarketEvent& event);

void reset();

double getSpread() const;
int getInventory() const;
double getCash() const;
int getTrades() const;


};

#endif
