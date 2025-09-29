const express = require("express");
const http = require("http");
const app = express();
const PORT = 3004;

// function to call service using HTTP GET with timeout
function callService(path, host, port, company, timeout) {
  return new Promise((resolve, reject) => {
    const url = `http://${host}:${port}${path}?company=${company}`;
    console.log(`Requesting: ${url}`);

    const req = http.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          console.error(`Error parsing JSON from ${url}:`, e.message);
          reject("Invalid JSON response");
        }
      });
    });

    req.on("error", (err) => {
      console.error(`Request error for ${url}:`, err.message);
      reject("Request error");
    });

    req.setTimeout(timeout, () => {
      console.error(`Request timeout for ${url}`);
      req.abort();
      reject("Timeout");
    });
  });
}

// Scatter-Gather route
app.get("/gather", async (req, res) => {
  const company = req.query.company;
  if (!company) {
    return res.status(400).json({ error: "Missing 'company' query parameter" });
  }

  const timeout = 2000; // 2 seconds timeout

  // Call the three services in parallel using container hostnames
  const services = [
    callService("/rate", "rate-service", 3001, company, timeout),
    callService("/allocation", "allocation-service", 3002, company, timeout),
    callService("/logistic", "logistic-service", 3003, company, timeout),
  ];

  try {
    const results = await Promise.all(services);

    const responses = results.map((result, i) => {
      switch (i) {
        case 0:
          return { service: "RateService", time: result.time, value: result.value };
        case 1:
          return { service: "AllocationService", duration: result.duration };
        case 2:
          return { service: "LogisticService", location: result.location };
        default:
          return result;
      }
    });

    res.json({ company, responses });
  } catch (error) {
    console.error("Error gathering service data:", error);
    res.status(500).json({ error: "Failed to get data from all services" });
  }
});

app.listen(PORT, () => {
  console.log(`Aggregator running on port ${PORT}`);
});
