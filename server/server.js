const express =require("express");
const mongoose= require("mongoose");
const body= require ("body-parser");
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app= express();
const port=process.env.PORT || 8000;
// import routes
const authRoutes = require('./routes/auth');
const uri = "mongodb+srv://MahmoudReda:x1zuQXJqVHnaZwco@firstcluster.23iywgv.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("the database is connected"))
.catch(err=>console.log(err));

app.use(cors({origin:process.env.CLIENT_URL}));
app.use(morgan('dev'));
app.use(body.json())

app.use("/api",authRoutes);

app.listen(port,function(){
    console.log(`the server is running now ${port}`);
})

