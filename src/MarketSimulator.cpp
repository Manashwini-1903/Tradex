#include "../include/MarketSimulator.h"

#include <cstdlib>

MarketSimulator::MarketSimulator(double price) {
startingPrice = price;
}

std::vector<MarketEvent> MarketSimulator::generateEvents(int steps) {
std::vector<MarketEvent> events;
double price = startingPrice;

for (int i = 1; i <= steps; i++) {
    int movement = (std::rand() % 5) - 2;
    price += movement;

    if (price < 1.0) {
        price = 1.0;
    }

    int orderType = std::rand() % 3;

    MarketEvent event;
    event.step = i;
    event.price = price;
    event.orderType = orderType;

    events.push_back(event);
}

return events;

}
