const express = require('express');
const app = express ();

const port = 3001;

app.get('/rate', (req,res)=>{

    const company = req.query.company;
    const ratePayload = {
        company,
        time:Date.now(),
        value: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000           //const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    };

    res.json(ratePayload);

});

app.listen(port,()=>{

    console.log(`rat service is running on ${port}`);
})