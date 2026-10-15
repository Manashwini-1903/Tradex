#ifndef MARKETMAKER_H
#define MARKETMAKER_H

class MarketMaker {
private:
    double cash;
    double initialCash;
    int inventory;
    int maxInventory;

public:
    MarketMaker(double money, int limit);

    bool buyShare(double price);
    bool sellShare(double price);

    double getCash();
    int getInventory();

    double getProfitLoss(double marketPrice);
};

#endif