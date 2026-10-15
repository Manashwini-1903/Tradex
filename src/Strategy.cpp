#include "Strategy.h"
#include "MarketMaker.h"

StrategyResult Strategy::run(
    vector<MarketEvent> events,
    string name,
    bool inventoryAware,
    double initialCash,
    double spread,
    int maxInventory
) {
    MarketMaker maker(initialCash, maxInventory);

    StrategyResult result;

    result.name = name;
    result.finalProfitLoss = 0;
    result.finalInventory = 0;
    result.trades = 0;

    for (int i = 0; i < events.size(); i++) {
        double price = events[i].price;

        double adjustment = 0;

        if (inventoryAware) {
            adjustment = maker.getInventory() * 0.1;
        }

        double bidPrice = price - spread / 2 - adjustment;
        double askPrice = price + spread / 2 - adjustment;

        if (bidPrice < 0.01) {
            bidPrice = 0.01;
        }

        if (askPrice <= bidPrice) {
            askPrice = bidPrice + 0.01;
        }

        bool traded = false;

        if (events[i].orderType == 1) {
            traded = maker.sellShare(askPrice);
        }
        else if (events[i].orderType == 2) {
            traded = maker.buyShare(bidPrice);
        }

        if (traded) {
            result.trades++;
        }

        SimulationRecord record;

        record.step = i + 1;
        record.marketPrice = price;
        record.bidPrice = bidPrice;
        record.askPrice = askPrice;
        record.inventory = maker.getInventory();
        record.profitLoss = maker.getProfitLoss(price);

        result.records.push_back(record);
    }

    double finalPrice = events.back().price;

    result.finalProfitLoss = maker.getProfitLoss(finalPrice);
    result.finalInventory = maker.getInventory();

    return result;
}