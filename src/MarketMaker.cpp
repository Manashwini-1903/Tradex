
#include "../include/MarketMaker.h"

#include <algorithm>

MarketMaker::MarketMaker(
    double spreadValue,
    int inventoryLimit,
    bool useInventoryAware
) {
    spread = spreadValue;
    maxInventory = inventoryLimit;
    inventoryAware = useInventoryAware;

    reset();
}

void MarketMaker::reset() {
    cash = 100000.0;
    inventory = 0;
    trades = 0;
}

TradingResult MarketMaker::processEvent(const MarketEvent& event) {
    double midPrice = event.price;

    // Adjust the quotes based on the current inventory.
    double inventoryAdjustment = 0.0;

    if (inventoryAware) {
        inventoryAdjustment =
            (static_cast<double>(inventory) / maxInventory)
            * (spread / 2.0);
    }

    double bidPrice =
        midPrice - spread / 2.0 - inventoryAdjustment;

    double askPrice =
        midPrice + spread / 2.0 - inventoryAdjustment;

    // Process the simulated incoming order.
    if (event.orderType == 1 && inventory < maxInventory) {
        inventory++;
        cash -= bidPrice;
        trades++;
    }
    else if (event.orderType == 2 && inventory > -maxInventory) {
        inventory--;
        cash += askPrice;
        trades++;
    }

    // Mark the portfolio to the current market price.
    double profitLoss =
        cash + inventory * midPrice - 100000.0;

    TradingResult result;

    result.step = event.step;
    result.marketPrice = midPrice;
    result.bidPrice = bidPrice;
    result.askPrice = askPrice;
    result.inventory = inventory;
    result.cash = cash;
    result.profitLoss = profitLoss;
    result.trades = trades;

    return result;
}

double MarketMaker::getSpread() const {
    return spread;
}

int MarketMaker::getInventory() const {
    return inventory;
}

double MarketMaker::getCash() const {
    return cash;
}

int MarketMaker::getTrades() const {
    return trades;
}

