
#include "../include/Strategy.h"

#include <vector>

std::vector<TradingResult> Strategy::runFixedSpread(
    const std::vector<MarketEvent>& events,
    double spread,
    int maxInventory
) {
    MarketMaker maker(spread, maxInventory, false);

    std::vector<TradingResult> results;

    for (const MarketEvent& event : events) {
        results.push_back(maker.processEvent(event));
    }

    return results;
}

std::vector<TradingResult> Strategy::runInventoryAware(
    const std::vector<MarketEvent>& events,
    double spread,
    int maxInventory
) {
    MarketMaker maker(spread, maxInventory, true);

    std::vector<TradingResult> results;

    for (const MarketEvent& event : events) {
        results.push_back(maker.processEvent(event));
    }

    return results;
}

