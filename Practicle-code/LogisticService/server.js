const express = require('express');
const app = express();
const port = 3003;

app.get('/logistic', (req, res) => {
  const company = req.query.company;

  const logisticPayload = {
    company,
    time: Date.now(),
    location: [
      "Warehouse A",
      "Checkpoint B",
      "Port C",
      "Delivery Hub D"
    ] 
  };

  res.json(logisticPayload);
});

app.listen(port, () => {
  console.log(`Logistic Service running on port ${port}`);
});
