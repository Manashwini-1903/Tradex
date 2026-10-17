#ifndef CSV_EXPORTER_H
#define CSV_EXPORTER_H

#include <vector>
#include <string>
#include "MarketMaker.h"

class CSVExporter {
public:
static bool exportResults(
const std::string& filename,
const std::vector<TradingResult>& fixedResults,
const std::vector<TradingResult>& smartResults
);
};

#endif
