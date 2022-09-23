const express = require('express');
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const ConnectDB=require("./config/db");
const AuthRouter = require('./routes/auth');
require('dotenv').config();

const app=express();
app.use(express.json())
app.use(cors({origin:process.env.CLIENT_URL}))
const port=process.env.PORT||5000
app.listen(port,()=>{
    ConnectDB();
    console.log("running on port 5000")
})
app.use("/api",AuthRouter)