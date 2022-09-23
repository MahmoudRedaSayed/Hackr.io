const mongoose=require("mongoose")

const ConnectDB = async ()=>{
    try{
        const con= await mongoose.connect(process.env.DATABASE_API,{
            useUnifiedTopology:true,
        })
        console.log("the connection is stable");
    }
    catch(error)
    {
        console.log(error.message)
        process.exit(1);
    }
}

module.exports = ConnectDB; 