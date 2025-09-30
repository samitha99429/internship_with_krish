const express = require("express");
const http = require("http");
const app = express();
const PORT = 3004;

// function to call other service
function callService(path, host, port, company, timeout) {
  return new Promise((resolve) => {
    const url = `http://${host}:${port}${path}?company=${company}`;
    console.log(`Requesting: ${url}`);

    const req = http.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {             //Called when all chunks are received.
        try {
          const json = JSON.parse(data);
          resolve({ success: true, data: json });
        } catch (e) {
          console.error(`Error parsing JSON from ${url}:`, e.message);
          resolve({ success: false, error: "Invalid JSON response" });
        }
      });
    });

    req.on("error", (err) => {
      console.error(`Request error for ${url}:`, err.message);
      resolve({ success: false, error: "Request error" });
    });

    req.setTimeout(timeout, () => {       //set maximum time
      console.error(`Request timeout for ${url}`);
      req.abort();
      resolve({ success: false, error: "Timeout" });
    });
  });
}

// Scatter Gather route
app.get("/gather", async (req, res) => {
  const company = req.query.company;
  if (!company) {
    return res.status(400).json({ error: "Missing 'company' query parameter" });
  }

  const timeout = 2000;    //2 seconds per-service timeout

  const rate = callService("/rate", "rate-service", 3001, company, timeout)
  const allocation = callService("/allocation", "allocation-service", 3002, company, timeout)
  const logistic = callService("/logistic", "logistic-service", 3003, company, timeout)

  try {
    const results = await Promise.allSettled([rate, allocation, logistic])

    const responses = []

    // RateService
    const r = results[0].value
    if (r && r.success) {
      responses.push({ service: "RateService", time: r.data.time, value: r.data.value })
    } else {
      responses.push({ service: "RateService", error: r ? r.error : "unknown" })
    }

    // AllocationService
    const a = results[1].value
    if (a && a.success) {
      responses.push({ service: "AllocationService", duration: a.data.duration })
    } else {
      responses.push({ service: "AllocationService", error: a ? a.error : "unknown" })
    }

    // LogisticService
    const l = results[2].value
    if (l && l.success) {
      responses.push({ service: "LogisticService", location: l.data.location })
    } else {
      responses.push({ service: "LogisticService", error: l ? l.error : "unknown" })
    }

    res.json({ company, responses })

  } catch (err) {
    console.log("Aggregator crash:", err)
    res.status(500).json({ error: "aggregator failed" })
  }
})

app.listen(PORT, () => {
  console.log("Aggregator running on port", PORT)
})