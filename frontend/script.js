const INITIAL_CASH = 100000;
const INITIAL_PRICE = 100;

let priceChart = null;
let historyRecords = [];
let showAllHistory = false;

/* =========================
HELPER FUNCTIONS
========================= */

function getElement(id) {
return document.getElementById(id);
}

function formatMoney(value) {
const number = Number(value);


if (!Number.isFinite(number)) {
    return "₹0.00";
}

return "₹" + number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
   

}

function formatNumber(value) {
const number = Number(value);

   
if (!Number.isFinite(number)) {
    return "0";
}

return number.toLocaleString("en-IN");
   

}

function setStatus(id, message, type) {
const element = getElement(id);

   
if (!element) {
    return;
}

element.textContent = message;
element.className = "";

if (type) {
    element.classList.add(type);
}
   

}

function randomBetween(min, max) {
return Math.random() * (max - min) + min;
}

/* =========================
CHART
========================= */

function createChart() {

   
const canvas = getElement("priceChart");

if (!canvas) {
    return;
}

if (typeof Chart === "undefined") {
    setStatus(
        "formStatus",
        "Chart.js could not load. Check your internet connection.",
        "error"
    );
    return;
}

priceChart = new Chart(canvas, {

    type: "line",

    data: {

        labels: [0],

        datasets: [{
            label: "Market Price",
            data: [INITIAL_PRICE],
            borderColor: "#829dff",
            backgroundColor: "rgba(108, 140, 255, 0.12)",
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: true,
            tension: 0.25
        }]

    },

    options: {

        responsive: true,
        maintainAspectRatio: false,

        interaction: {
            intersect: false,
            mode: "index"
        },

        plugins: {

            legend: {
                display: false
            },

            tooltip: {

                callbacks: {

                    label: function(context) {
                        return "Price: " +
                            formatMoney(context.parsed.y);
                    }

                }

            }

        },

        scales: {

            x: {

                title: {
                    display: true,
                    text: "Simulation Step",
                    color: "#8d9bb5"
                },

                ticks: {
                    color: "#8d9bb5",
                    maxTicksLimit: 10
                },

                grid: {
                    color: "rgba(141, 155, 181, 0.08)"
                }

            },

            y: {

                ticks: {

                    color: "#8d9bb5",

                    callback: function(value) {
                        return "₹" + value;
                    }

                },

                grid: {
                    color: "rgba(141, 155, 181, 0.08)"
                }

            }

        }

    }

});
   

}

/* =========================
MARKET METRICS
========================= */

function updateMarketMetrics(price, spread, steps) {

   
const safePrice = Number(price);
const safeSpread = Number(spread);

const bid = safePrice - safeSpread / 2;
const ask = safePrice + safeSpread / 2;

getElement("bannerPrice").textContent =
    formatMoney(safePrice);

getElement("marketPrice").textContent =
    formatMoney(safePrice);

getElement("bidPrice").textContent =
    formatMoney(bid);

getElement("askPrice").textContent =
    formatMoney(ask);

getElement("spreadValue").textContent =
    formatMoney(ask - bid);

getElement("chartLatestPrice").textContent =
    formatMoney(safePrice);

getElement("chartStepCount").textContent =
    formatNumber(steps);
   

}

/* =========================
STRATEGY CARDS
========================= */

function updateStrategyCard(prefix, result) {

   
const pnl = getElement(prefix + "PnL");

if (!pnl) {
    return;
}

pnl.textContent = formatMoney(result.pnl);

getElement(prefix + "Trades").textContent =
    formatNumber(result.trades);

getElement(prefix + "Inventory").textContent =
    formatNumber(result.inventory);

getElement(prefix + "Cash").textContent =
    formatMoney(result.cash);

pnl.classList.remove("positive", "negative");

if (result.pnl > 0) {
    pnl.classList.add("positive");
}

if (result.pnl < 0) {
    pnl.classList.add("negative");
}
   

}

function resetStrategyCards() {

   
const result = {
    pnl: 0,
    trades: 0,
    inventory: 0,
    cash: INITIAL_CASH
};

updateStrategyCard("fixed", result);
updateStrategyCard("smart", result);
   

}

/* =========================
UPDATE CHART
========================= */

function updateChart(prices) {

   
if (!priceChart) {
    return;
}

priceChart.data.labels =
    prices.map(function(_, index) {
        return index;
    });

priceChart.data.datasets[0].data = prices;

priceChart.update();
   

}

/* =========================
TRADE HISTORY
========================= */

function renderHistory() {

   
const body = getElement("historyBody");
const count = getElement("historyCount");
const message = getElement("historyMessage");
const showButton = getElement("showAllButton");

const total = historyRecords.length;

count.textContent =
    total + (total === 1 ? " record" : " records");

if (total === 0) {

    body.innerHTML =
        '<tr>' +
        '<td colspan="6" class="empty">' +
        'No simulation results available.' +
        '</td>' +
        '</tr>';

    message.textContent =
        "Run a simulation to view its history.";

    showButton.hidden = true;

    return;
}

let visibleRecords;

if (showAllHistory) {
    visibleRecords = historyRecords;
} else {
    visibleRecords = historyRecords.slice(-10);
}

body.innerHTML = visibleRecords.map(function(row) {

    return (
        "<tr>" +
        "<td>" + row.step + "</td>" +
        "<td>" + formatMoney(row.price) + "</td>" +
        "<td>" + row.event + "</td>" +
        "<td>" + formatMoney(row.bid) + "</td>" +
        "<td>" + formatMoney(row.ask) + "</td>" +
        "<td>" + row.inventory + "</td>" +
        "</tr>"
    );

}).join("");

if (total > 10 && !showAllHistory) {

    message.textContent =
        "Showing the latest 10 of " + total + " records.";

    showButton.textContent = "Show All";
    showButton.hidden = false;

} else if (total > 10 && showAllHistory) {

    message.textContent =
        "Showing all " + total + " records.";

    showButton.textContent = "Show Latest 10";
    showButton.hidden = false;

} else {

    message.textContent =
        "Showing " + total + " simulation records.";

    showButton.hidden = true;
}
   

}

/* =========================
BROWSER SIMULATION
========================= */

function runBrowserSimulation(steps, maxInventory, spread) {

   
let marketPrice = INITIAL_PRICE;

const prices = [INITIAL_PRICE];
const records = [];

const fixed = {
    cash: INITIAL_CASH,
    inventory: 0,
    trades: 0
};

const smart = {
    cash: INITIAL_CASH,
    inventory: 0,
    trades: 0
};


for (let step = 1; step <= steps; step++) {

    /* Market price movement */

    marketPrice += randomBetween(-1.5, 1.5);

    if (marketPrice < 1) {
        marketPrice = 1;
    }

    marketPrice =
        Number(marketPrice.toFixed(2));

    prices.push(marketPrice);


    /* Random order event */

    const eventNumber =
        Math.floor(Math.random() * 3);

    let event = "No Trade";

    if (eventNumber === 1) {
        event = "Buy";
    }

    if (eventNumber === 2) {
        event = "Sell";
    }


    /* Fixed Spread */

    const fixedBid =
        marketPrice - spread / 2;

    const fixedAsk =
        marketPrice + spread / 2;


    /* Inventory Aware */

    const inventoryShift =
        (smart.inventory / maxInventory) *
        (spread / 2);

    const smartBid =
        marketPrice -
        spread / 2 -
        inventoryShift;

    const smartAsk =
        marketPrice +
        spread / 2 -
        inventoryShift;


    /* Execute event */

    if (event === "Buy") {

        if (fixed.inventory < maxInventory) {

            fixed.inventory++;
            fixed.cash -= fixedAsk;
            fixed.trades++;

        }

        if (smart.inventory < maxInventory) {

            smart.inventory++;
            smart.cash -= smartAsk;
            smart.trades++;

        }

    }


    if (event === "Sell") {

        if (fixed.inventory > -maxInventory) {

            fixed.inventory--;
            fixed.cash += fixedBid;
            fixed.trades++;

        }

        if (smart.inventory > -maxInventory) {

            smart.inventory--;
            smart.cash += smartBid;
            smart.trades++;

        }

    }


    records.push({

        step: step,
        price: marketPrice,
        event: event,
        bid: Number(fixedBid.toFixed(2)),
        ask: Number(fixedAsk.toFixed(2)),
        inventory: fixed.inventory

    });

}


/* Mark-to-market P/L */

fixed.pnl =
    fixed.cash +
    fixed.inventory * marketPrice -
    INITIAL_CASH;

smart.pnl =
    smart.cash +
    smart.inventory * marketPrice -
    INITIAL_CASH;


return {

    prices: prices,
    records: records,
    finalPrice: marketPrice,

    fixed: {
        cash: fixed.cash,
        inventory: fixed.inventory,
        trades: fixed.trades,
        pnl: fixed.pnl
    },

    smart: {
        cash: smart.cash,
        inventory: smart.inventory,
        trades: smart.trades,
        pnl: smart.pnl
    }

};
   

}

/* =========================
RUN SIMULATION
========================= */

function handleSimulation(event) {

   
event.preventDefault();

const steps =
    Number(getElement("steps").value);

const maxInventory =
    Number(getElement("maxInventory").value);

const spread =
    Number(getElement("spread").value);


if (
    !Number.isInteger(steps) ||
    steps < 1 ||
    steps > 10000
) {

    setStatus(
        "formStatus",
        "Simulation steps must be between 1 and 10,000.",
        "error"
    );

    return;
}


if (
    !Number.isInteger(maxInventory) ||
    maxInventory < 1 ||
    maxInventory > 10000
) {

    setStatus(
        "formStatus",
        "Maximum inventory must be between 1 and 10,000.",
        "error"
    );

    return;
}


if (
    !Number.isFinite(spread) ||
    spread < 0.01 ||
    spread > 100000
) {

    setStatus(
        "formStatus",
        "Spread must be between 0.01 and 100,000.",
        "error"
    );

    return;
}


const button = getElement("runButton");

button.disabled = true;
button.textContent = "⏳ Running...";


try {

    const result =
        runBrowserSimulation(
            steps,
            maxInventory,
            spread
        );


    updateChart(result.prices);


    updateMarketMetrics(
        result.finalPrice,
        spread,
        steps
    );


    updateStrategyCard(
        "fixed",
        result.fixed
    );


    updateStrategyCard(
        "smart",
        result.smart
    );


    historyRecords =
        result.records;

    showAllHistory = false;

    renderHistory();


    setStatus(
        "formStatus",
        "Simulation completed successfully.",
        "success"
    );


} catch (error) {

    console.error(error);

    setStatus(
        "formStatus",
        "Simulation failed. Check the browser console.",
        "error"
    );

} finally {

    button.disabled = false;
    button.textContent = "▶ Run Simulation";

}
   

}

/* =========================
CSV PARSER
========================= */

function parseCSVLine(line) {

   
const values = [];
let current = "";
let quotes = false;


for (let i = 0; i < line.length; i++) {

    const char = line[i];


    if (char === '"') {

        if (
            quotes &&
            line[i + 1] === '"'
        ) {

            current += '"';
            i++;

        } else {

            quotes = !quotes;

        }

    } else if (
        char === "," &&
        !quotes
    ) {

        values.push(current.trim());
        current = "";

    } else {

        current += char;

    }
}


values.push(current.trim());

return values;
   

}

/* =========================
CSV PARSING
========================= */

function parseCSV(csvText) {

   
const lines =
    csvText
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .filter(function(line) {
            return line.trim() !== "";
        });


if (lines.length < 2) {
    throw new Error("CSV file contains no data.");
}


const headers =
    parseCSVLine(lines[0]).map(function(header) {

        return header
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");

    });


const required = [
    "step",
    "strategy",
    "marketprice",
    "bidprice",
    "askprice",
    "inventory",
    "cash",
    "profitloss",
    "trades"
];


for (const header of required) {

    if (!headers.includes(header)) {

        throw new Error(
            "Missing CSV column: " + header
        );

    }

}


const index = {};

headers.forEach(function(header, i) {
    index[header] = i;
});


const records = [];


for (let i = 1; i < lines.length; i++) {

    const values =
        parseCSVLine(lines[i]);


    const record = {

        step: Number(values[index.step]),

        strategy:
            values[index.strategy],

        price:
            Number(values[index.marketprice]),

        bid:
            Number(values[index.bidprice]),

        ask:
            Number(values[index.askprice]),

        inventory:
            Number(values[index.inventory]),

        cash:
            Number(values[index.cash]),

        pnl:
            Number(values[index.profitloss]),

        trades:
            Number(values[index.trades])

    };


    if (
        !Number.isFinite(record.step) ||
        !Number.isFinite(record.price) ||
        !Number.isFinite(record.bid) ||
        !Number.isFinite(record.ask) ||
        !Number.isFinite(record.inventory) ||
        !Number.isFinite(record.cash) ||
        !Number.isFinite(record.pnl) ||
        !Number.isFinite(record.trades)
    ) {

        throw new Error(
            "Invalid numeric data on CSV row " +
            (i + 1)
        );

    }


    records.push(record);
}


if (records.length === 0) {
    throw new Error("No valid CSV rows found.");
}


return records;
   

}

/* =========================
IMPORT CSV
========================= */

function importCSV() {

   
const input = getElement("csvFileInput");

const file = input.files[0];


if (!file) {

    setStatus(
        "csvImportStatus",
        "Please select a CSV file first.",
        "error"
    );

    return;
}


const reader = new FileReader();


setStatus(
    "csvImportStatus",
    "Reading CSV file..."
);


reader.onload = function() {

    try {

        const records =
            parseCSV(reader.result);


        const fixedRows =
            records.filter(function(row) {

                return row.strategy
                    .toLowerCase()
                    .includes("fixed");

            });


        const smartRows =
            records.filter(function(row) {

                return row.strategy
                    .toLowerCase()
                    .includes("inventory");

            });


        if (
            fixedRows.length === 0 &&
            smartRows.length === 0
        ) {

            throw new Error(
                "Could not identify the strategies in this CSV."
            );

        }


        const displayRows =
            fixedRows.length > 0
                ? fixedRows
                : smartRows;


        historyRecords =
            displayRows.map(function(row, index) {

                let event = "Recorded";

                if (index > 0) {

                    const previous =
                        displayRows[index - 1].inventory;


                    if (row.inventory > previous) {
                        event = "Buy";
                    } else if (row.inventory < previous) {
                        event = "Sell";
                    }

                }


                return {

                    step: row.step,
                    price: row.price,
                    event: event,
                    bid: row.bid,
                    ask: row.ask,
                    inventory: row.inventory

                };

            });


        showAllHistory = false;

        renderHistory();


        updateChart(
            displayRows.map(function(row) {
                return row.price;
            })
        );


        const last =
            displayRows[displayRows.length - 1];


        updateMarketMetrics(
            last.price,
            last.ask - last.bid,
            last.step
        );


        if (fixedRows.length > 0) {

            const fixedLast =
                fixedRows[fixedRows.length - 1];

            updateStrategyCard(
                "fixed",
                {
                    cash: fixedLast.cash,
                    pnl: fixedLast.pnl,
                    trades: fixedLast.trades,
                    inventory: fixedLast.inventory
                }
            );

        }


        if (smartRows.length > 0) {

            const smartLast =
                smartRows[smartRows.length - 1];

            updateStrategyCard(
                "smart",
                {
                    cash: smartLast.cash,
                    pnl: smartLast.pnl,
                    trades: smartLast.trades,
                    inventory: smartLast.inventory
                }
            );

        }


        setStatus(
            "csvImportStatus",
            "Successfully imported " +
            records.length +
            " records.",
            "success"
        );


        setStatus(
            "formStatus",
            "C++ CSV results loaded successfully.",
            "success"
        );


    } catch (error) {

        console.error(error);

        setStatus(
            "csvImportStatus",
            error.message,
            "error"
        );

    }

};


reader.onerror = function() {

    setStatus(
        "csvImportStatus",
        "Could not read the selected file.",
        "error"
    );

};


reader.readAsText(file);
   

}

/* =========================
INITIALIZATION
========================= */

document.addEventListener("DOMContentLoaded", function() {

   
createChart();

resetStrategyCards();

updateMarketMetrics(
    INITIAL_PRICE,
    2,
    0
);


const form =
    getElement("simulationForm");

const importButton =
    getElement("importCsvButton");

const showAllButton =
    getElement("showAllButton");


form.addEventListener(
    "submit",
    handleSimulation
);


importButton.addEventListener(
    "click",
    importCSV
);


showAllButton.addEventListener(
    "click",
    function() {

        showAllHistory =
            !showAllHistory;

        renderHistory();

    }
);


const navLinks =
    document.querySelectorAll(".nav-link");


navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        navLinks.forEach(function(item) {
            item.classList.remove("active");
        });

        link.classList.add("active");

    });

});


console.log(
    "TradeX frontend loaded successfully."
);
   

});
