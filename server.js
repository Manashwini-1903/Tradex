const express = require("express");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

const executable = path.join(
    __dirname,
    process.platform === "win32" ? "TradeX.exe" : "TradeX"
);
const dataDirectory = path.join(__dirname, "data");
const csvPath = path.join(dataDirectory, "results.csv");

const MAX_STEPS = 10000;
const MAX_INVENTORY = 10000;
const MAX_SPREAD = 100;

let simulationRunning = false;

// Allow the server to receive JSON from the website.
app.use(express.json({ limit: "10kb" }));

// Serve the frontend.
app.use(express.static(path.join(__dirname, "frontend")));

// Run the C++ simulator.
app.post("/api/simulate", (req, res) => {
const { steps, maxInventory, spread, seed } = req.body || {};

// Validate all inputs on the server.
if (
    !Number.isInteger(steps) ||
    !Number.isInteger(maxInventory) ||
    typeof spread !== "number" ||
    !Number.isFinite(spread) ||
    !Number.isInteger(seed) ||
    steps < 1 ||
    steps > MAX_STEPS ||
    maxInventory < 1 ||
    maxInventory > MAX_INVENTORY ||
    spread <= 0 ||
    spread > MAX_SPREAD ||
    seed < 0 ||
    seed > 4294967295
) {
    return res.status(400).json({
        error: "Invalid simulation settings."
    });
}

// Prevent two requests from using the same CSV simultaneously.
if (simulationRunning) {
    return res.status(409).json({
        error:
            "A simulation is already running. Please wait a moment and try again."
    });
}

if (!fs.existsSync(executable)) {
return res.status(500).json({
error: "TradeX executable was not found. Compile the C++ project first."
});
}


try {
    fs.mkdirSync(dataDirectory, { recursive: true });

    // Remove old results so stale data cannot be returned.
    if (fs.existsSync(csvPath)) {
        fs.unlinkSync(csvPath);
    }
} catch (error) {
    return res.status(500).json({
        error: "Could not prepare the simulation results file."
    });
}

simulationRunning = true;

const simulator = spawn(executable, [], {
    cwd: __dirname,
    windowsHide: true
});

let output = "";
let errorOutput = "";
let finished = false;
let timedOut = false;

// Release the server lock and respond at most once.
function finish(statusCode, responseBody) {
    if (finished) return;

    finished = true;
    clearTimeout(timeout);
    simulationRunning = false;

    if (!res.headersSent) {
        res.status(statusCode).json(responseBody);
    }
}

const timeout = setTimeout(() => {
    timedOut = true;
    simulator.kill();
}, 30000);

simulator.stdout.on("data", (data) => {
    output += data.toString();
});

simulator.stderr.on("data", (data) => {
    errorOutput += data.toString();
});

simulator.on("error", () => {
    finish(500, {
        error: "Could not start the C++ simulator. Check the executable and runtime."
    });
});

simulator.on("close", (code) => {
    if (finished) return;

    if (timedOut) {
        return finish(504, {
            error: "The simulation took too long and was stopped."
        });
    }

    if (code !== 0) {
        return finish(500, {
            error: "The C++ simulator failed.",
            details: errorOutput || output || "No additional details available."
        });
    }

    try {
        if (!fs.existsSync(csvPath)) {
            throw new Error("The simulator did not create data/results.csv.");
        }

        const csv = fs.readFileSync(csvPath, "utf8").trim();
        const lines = csv.split(/\r?\n/);

        if (lines.length < 2) {
            throw new Error("The results CSV is empty.");
        }

        const headers = lines[0]
            .split(",")
            .map(header => header.trim().toLowerCase());

        const requiredHeaders = [
    "step",
    "strategy",
    "marketprice",
    "bidprice",
    "askprice",
    "inventory",
    "cash",
    "profitloss",
    "trades",
    "tradeaction",
    "executionprice"
];

        for (const header of requiredHeaders) {
            if (!headers.includes(header)) {
                throw new Error(`Missing CSV column: ${header}`);
            }
        }

        const rows = lines.slice(1)
            .filter(line => line.trim() !== "")
            .map(line => {
                const values = line.split(",");

                if (values.length !== headers.length) {
                    throw new Error("A CSV row has an unexpected number of columns.");
                }

                const row = {};

                headers.forEach((header, index) => {
                    row[header] = values[index].trim();
                });

                return row;
            });

        const fixedResults = [];
        const smartResults = [];

        for (const row of rows) {
            const result = {
    step: Number(row.step),
    marketPrice: Number(row.marketprice),
    bidPrice: Number(row.bidprice),
    askPrice: Number(row.askprice),
    inventory: Number(row.inventory),
    cash: Number(row.cash),
    profitLoss: Number(row.profitloss),
    trades: Number(row.trades),

    // New trade details
    tradeAction: row.tradeaction,
    executionPrice: Number(row.executionprice)
};

            // Reject incomplete or invalid numeric data.
            if (
    !Number.isInteger(result.step) ||
    !Number.isFinite(result.marketPrice) ||
    !Number.isFinite(result.bidPrice) ||
    !Number.isFinite(result.askPrice) ||
    !Number.isInteger(result.inventory) ||
    !Number.isFinite(result.cash) ||
    !Number.isFinite(result.profitLoss) ||
    !Number.isInteger(result.trades) ||
    !Number.isFinite(result.executionPrice) ||
    typeof result.tradeAction !== "string" ||
    !["Buy", "Sell", "No Trade"].includes(result.tradeAction)
) {
    throw new Error("The CSV contains invalid simulation results.");
}

            const strategy = row.strategy.toLowerCase();

            if (strategy === "fixed spread") {
                fixedResults.push(result);
            } else if (strategy === "inventory aware") {
                smartResults.push(result);
            }
        }

        // Each strategy should have one result per simulation step.
        if (
            fixedResults.length !== steps ||
            smartResults.length !== steps
        ) {
            throw new Error(
                "The number of results does not match the requested simulation steps."
            );
        }

        return finish(200, {
            success: true,
            settings: {
                        steps,
                        maxInventory,
                        spread,
                        seed
                    },
            fixedResults,
            smartResults,
            message: "C++ simulation completed successfully."
        });

    } catch (error) {
        return finish(500, {
            error: "Could not read the C++ simulation results.",
            details: error.message
        });
    }
});

// Supply inputs in the order expected by main.cpp.
simulator.stdin.on("error", () => {
    // The process may close its input stream during shutdown.
    // The close event handles the final response.
});

simulator.stdin.end(
    `${steps}\n${maxInventory}\n${spread}\n${seed}\n`
);

});

// Handle malformed JSON requests.
app.use((error, req, res, next) => {
if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
return res.status(400).json({
error: "Invalid JSON request."
});
}


next(error);


});

// Start the server.
app.listen(PORT, "0.0.0.0", () => {
console.log(`TradeX server running on port ${PORT}`);
console.log(`Open http://localhost:${PORT} in your browser.`);
});

