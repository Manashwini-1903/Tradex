#include "MarketMaker.h"

MarketMaker::MarketMaker(double money, int limit) {
    cash = money;
    initialCash = money;
    inventory = 0;
    maxInventory = limit;
}

bool MarketMaker::buyShare(double price) {
    if (cash >= price && inventory < maxInventory) {
        cash = cash - price;
        inventory++;
        return true;
    }

    return false;
}

bool MarketMaker::sellShare(double price) {
    if (inventory > -maxInventory) {
        cash = cash + price;
        inventory--;
        return true;
    }

    return false;
}

double MarketMaker::getCash() {
    return cash;
}

int MarketMaker::getInventory() {
    return inventory;
}

double MarketMaker::getProfitLoss(double marketPrice) {
    double totalValue = cash + inventory * marketPrice;

    return totalValue - initialCash;
}