const AWS=require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: "us-east-1",
    });
const ses=new AWS.SES({apiVersion:"2010-12-01"})
exports.register =async (req, res) => {
    console.log(process.env.AWS_REGION)
    console.log('REGISTER CONTROLLER', req.body);
    const {email,password,name}=req.body;
    const params={
        Source:process.env.EMAIL_FROM,
        Destination:{ToAddresses:[email]},
        ReplyToAddresses:[process.env.EMAIL_TO],
        Message:{
            Body:{
                Html:{
                    Charset:"UTF-8",
                    Data:`<html><body><h1>${name}<span style="color:red">test email</span></h1></body></html>`
                }
            },
            Subject:{
                Charset:"UTF-8",
                Data:"complete registration"
            }
        }
    };
    const sendEmail= ses.sendEmail(params).promise();
    sendEmail.then(data=>{
        console.log("emial is sent "+data)
        res.status(200).json("email is sent");

    }).catch(error=>{
        console.log("error ",error)
        res.status(400).json("error in server");

    })
    // if(sendEmail)
    // {
    //     res.status(200).json("email is sent");
    // }
    // else
    // {
    //     res.status(400).json("error in server");
    // }
};
