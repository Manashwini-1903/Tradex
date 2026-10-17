#include "../include/MarketSimulator.h"

MarketSimulator::MarketSimulator(double price, unsigned int seed)
: startingPrice(price), generator(seed) {
}

std::vector<MarketEvent> MarketSimulator::generateEvents(int steps) {
std::vector<MarketEvent> events;


double price = startingPrice;

std::uniform_int_distribution<int> priceMovement(-2, 2);
std::uniform_int_distribution<int> orderDistribution(0, 2);

for (int i = 1; i <= steps; i++) {
    int movement = priceMovement(generator);

    price += movement;

    if (price < 1.0) {
        price = 1.0;
    }

    int orderType = orderDistribution(generator);

    MarketEvent event;
    event.step = i;
    event.price = price;
    event.orderType = orderType;

    events.push_back(event);
}

return events;


}
