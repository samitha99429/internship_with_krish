const express = require("express");
const http = require("http");
const app = express();
const PORT = 3004;

// function to call other service
function callService(path,host, port, company, timeout) {
  return new Promise((resolve) => {
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
          resolve({ success: true, data: json });
        } catch (e) {
          console.error(`Error parsing JSON from ${url}:`, e.message);
          resolve({ success: false, error: "Invalid JSON response" });
        }
      });
    });

    req.on("error", (err) => {
      console.error(`Request error for ${url}:`, err.message);
      resolve({ success: false, error: `Request  service error :${path}`});
    });

    req.setTimeout(timeout, () => {
      console.error(`Request timeout for ${url}`);
      req.abort();
      resolve({ success: false, error: "Service Timeout" });
    });
  });
}


function handleResult(result, fields) {
  if (result && result.success) {
    const defaults = {
      time: 0,
      value: 0,
      duration: 0,
      location: "unknown",
    };

    const data = {};
    fields.forEach((f) => {
      // Use service data if it exists, otherwise fallback to default
      data[f] = result.data[f] !== undefined ? result.data[f] : defaults[f];
    });
    return { ...data };
  } else {
    return { error: result ? result.error : "unknown" };
  }
}



// Scatter Gather route
app.get("/gather", async (req, res) => {
  const company = req.query.company;
  if (!company) {
    return res.status(400).json({ error: "Missing 'company' query parameter" });
  }


  const timeout = 2000; // 2 seconds per service timeout

  // prepare service calls
  const rate = callService("/rate", "rate-service", 3001, company, timeout);
  const allocation = callService("/allocation", "allocation-service", 3002, company, timeout);
  const logistic = callService("/logistic", "logistic-service", 3003, company, timeout);

  try {
    const results = await Promise.allSettled([rate, allocation, logistic]);

  
    const responses = [
      handleResult( results[0].value, ["time", "value"]),
      handleResult( results[1].value, ["duration"]),
      handleResult( results[2].value, ["location"]),
    ];

    res.json({ company, responses });
  } catch (err) {
    console.log("Aggregator crash:", err);
    res.status(500).json({ error: "aggregator is failed" });
  }
});

app.listen(PORT, () => {
  console.log("Aggregator running on port", PORT);
});
