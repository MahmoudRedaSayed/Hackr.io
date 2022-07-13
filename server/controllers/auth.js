exports.register=(req,res)=>{
    console.log(req.body);
    res.json({"done":  `the data is correct ${req.body}`});
}