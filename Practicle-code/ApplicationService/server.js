const express = require("express");
const http = require("http");
const app = express();
const PORT = 3000;

// function to call service using HTTP GET with timeout
function callService(path, port, company, timeout) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:${port}${path}?company=${company}`;
    console.log(`Requesting: ${url}`);

    const req = http.get(url, (res) => {
      let data = "";

      // Collect data chunks
      res.on("data", (chunk) => {
        data += chunk;
      });

      // When response ends, parse the JSON
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

    // Handle request errors
    req.on("error", (err) => {
      console.error(`Request error for ${url}:`, err.message);
      reject("Request error");
    });

    // Timeout handling: abort request if takes too long
    req.setTimeout(timeout, () => {
      console.error(`Request timeout for ${url}`);
      req.abort();
      reject("Timeout");
    });
  });
}

// Scatter-Gather route: calls multiple services in parallel
app.get("/gather", async (req, res) => {
  const company = req.query.company;
  if (!company) {
    return res.status(400).json({ error: "Missing 'company' query parameter" });
  }

  const timeout = 2000; // 2 seconds timeout

  // Call the three services in parallel
  const services = [
    callService("/rate", 3001, company, timeout),
    callService("/allocation", 3002, company, timeout),
    callService("/logistic", 3003, company, timeout),
  ];

  try {
    // Wait for all promises to resolve
    const results = await Promise.all(services);

    // Map results to readable response format
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

