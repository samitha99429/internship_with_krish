const express = require ('express');
const app = express();
const port = 3002;

app.get('/allocation', (req,res)=>{

    
    const company = req.query.company;
    const allocationPayload = {

        company,
        time:Date.now(),
        duration:Math.floor(Math.random()*(100-10+1)) +10,

    }

    res.json(allocationPayload);
  
});



app.listen(port,()=>{

    console.log(`Allocation service is running on ${port}`)
});