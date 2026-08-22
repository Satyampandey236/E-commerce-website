const express = require("express");

const app = express();
const PORT = 8000; 




app.get("/", (req, res) => {
    res.send("E-Commerce Backend Running");
});

app.listen(PORT, ()=> console.log(`Server Started at PORT:${PORT}`));
