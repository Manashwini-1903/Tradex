#include "MarketSimulator.h"
#include <cstdlib>

vector<MarketEvent> MarketSimulator::generateMarket(int steps) {
    vector<MarketEvent> events;

    double price = 100;

    for (int i = 0; i < steps; i++) {
        int change = rand() % 5 - 2;
        price = price + change;

        if (price < 1) {
            price = 1;
        }

        int order = rand() % 3;

        MarketEvent event;
        event.price = price;
        event.orderType = order;

        events.push_back(event);
    }

    return events;
}