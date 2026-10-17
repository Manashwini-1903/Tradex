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
    body.innerHTML = `
        <tr>
            <td colspan="9" class="empty">
                No simulation results available.
            </td>
        </tr>
    `;

    message.textContent =
        "Run a simulation to view its history.";

    showButton.hidden = true;
    return;
}

const visibleRecords = showAllHistory
    ? historyRecords
    : historyRecords.slice(-10);

body.innerHTML = visibleRecords.map(function(row) {
    return `
        <tr>
            <td>${row.step}</td>
            <td>${row.strategy}</td>
            <td>${formatMoney(row.price)}</td>
            <td>${row.event}</td>
            <td>${row.executionPrice > 0
                ? formatMoney(row.executionPrice)
                : "—"}</td>
            <td>${formatMoney(row.bid)}</td>
            <td>${formatMoney(row.ask)}</td>
            <td>${row.inventory}</td>
            <td>${formatMoney(row.pnl)}</td>
        </tr>
    `;
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
RUN C++ SIMULATION
========================= */

async function handleSimulation(event) {

    event.preventDefault();

    const steps = Number(getElement("steps").value);
    const maxInventory = Number(getElement("maxInventory").value);
    const spread = Number(getElement("spread").value);
    const seed = Number(document.getElementById("seed").value);
    // Validate random seed
if (
    !Number.isInteger(seed) ||
    seed < 0 ||
    seed > 4294967295
) {
    setStatus(
        "formStatus",
        "Random seed must be a whole number between 0 and 4294967295.",
        "error"
    );
    return;
}

    // Validate simulation steps
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

    // Validate maximum inventory
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

    // Validate spread
    if (
        !Number.isFinite(spread) ||
        spread < 0.01 ||
        spread > 100
    ) {
        setStatus(
            "formStatus",
            "Spread must be between 0.01 and 100.",
            "error"
        );
        return;
    }

    const button = getElement("runButton");

    button.disabled = true;
    button.textContent = "⏳ Running C++ Simulator...";

    setStatus(
        "formStatus",
        "Connecting to the C++ simulator...",
        ""
    );

    try {

        // Send the user's settings to the Node.js backend.
        const response = await fetch("/api/simulate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                steps: steps,
                maxInventory: maxInventory,
                spread: spread,
                seed: seed
            })

        });

        // Convert the backend response into a JavaScript object.
        const data = await response.json();

        // Handle errors returned by the backend.
        if (!response.ok) {
            throw new Error(
                data.details
                    ? data.error + " " + data.details
                    : data.error || "Simulation failed."
            );
        }

        // Confirm that both C++ strategies returned results.
        if (
            !data.fixedResults ||
            !data.smartResults ||
            data.fixedResults.length === 0 ||
            data.smartResults.length === 0
        ) {
            throw new Error(
                "The C++ simulator did not return both strategies."
            );
        }

        const fixedResults = data.fixedResults;
        const smartResults = data.smartResults;

        // Get the final result for each strategy.
        const fixedLast =
            fixedResults[fixedResults.length - 1];

        const smartLast =
            smartResults[smartResults.length - 1];

        // Update the Fixed Spread strategy card.
        updateStrategyCard("fixed", {
            pnl: fixedLast.profitLoss,
            trades: fixedLast.trades,
            inventory: fixedLast.inventory,
            cash: fixedLast.cash
        });

        // Update the Inventory-Aware strategy card.
        updateStrategyCard("smart", {
            pnl: smartLast.profitLoss,
            trades: smartLast.trades,
            inventory: smartLast.inventory,
            cash: smartLast.cash
        });

        // Update the price chart using actual C++ results.
        const prices = fixedResults.map(function(row) {
            return row.marketPrice;
        });

        updateChart(prices);

        // Update the market metrics using the final C++ result.
        getElement("bannerPrice").textContent =
            formatMoney(fixedLast.marketPrice);

        getElement("marketPrice").textContent =
            formatMoney(fixedLast.marketPrice);

        getElement("bidPrice").textContent =
            formatMoney(fixedLast.bidPrice);

        getElement("askPrice").textContent =
            formatMoney(fixedLast.askPrice);

        getElement("spreadValue").textContent =
            formatMoney(
                fixedLast.askPrice - fixedLast.bidPrice
            );

        getElement("chartLatestPrice").textContent =
            formatMoney(fixedLast.marketPrice);

        getElement("chartStepCount").textContent =
            formatNumber(fixedLast.step);

        // Combine results from both strategies.
historyRecords = [];

fixedResults.forEach(function(row) {
    historyRecords.push({
        step: row.step,
        strategy: "Fixed Spread",
        price: row.marketPrice,
        event: row.tradeAction,
        executionPrice: row.executionPrice,
        bid: row.bidPrice,
        ask: row.askPrice,
        inventory: row.inventory,
        pnl: row.profitLoss
    });
});

smartResults.forEach(function(row) {
    historyRecords.push({
        step: row.step,
        strategy: "Inventory Aware",
        price: row.marketPrice,
        event: row.tradeAction,
        executionPrice: row.executionPrice,
        bid: row.bidPrice,
        ask: row.askPrice,
        inventory: row.inventory,
        pnl: row.profitLoss
    });
});

// Display records in simulation-step order.
historyRecords.sort(function(a, b) {
    if (a.step !== b.step) {
        return a.step - b.step;
    }

    if (a.strategy === b.strategy) {
        return 0;
    }

    return a.strategy === "Fixed Spread" ? -1 : 1;
});

showAllHistory = false;

renderHistory();

        renderHistory();

        // Display success.
        setStatus(
            "formStatus",
            "C++ simulation completed successfully!",
            "success"
        );

        console.log("C++ simulation results:", data);

    } catch (error) {

        console.error("TradeX simulation error:", error);

        setStatus(
            "formStatus",
            "Simulation failed: " + error.message,
            "error"
        );

    } finally {

        button.disabled = false;
        button.textContent = "▶ Run Simulation";

    }

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



const showAllButton =
    getElement("showAllButton");


form.addEventListener(
    "submit",
    handleSimulation
);





showAllButton.addEventListener(
    "click",
    function() {

        showAllHistory =
            !showAllHistory;

        renderHistory();

    }
);


const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        navLinks.forEach((item) => {
            item.classList.remove("active");
        });

        link.classList.add("active");

        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


console.log(
    "TradeX frontend loaded successfully."
);
   

});
