const AWS=require("aws-sdk");
const JWT=require("jsonwebtoken");
const User=require("../models/user");
const shortId = require('shortid');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: "us-east-1",
    });
AWS.config.update({
    accessKeyId: "AKIAZEDEI27HXBV7DYZ4",
    secretAccessKey: "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",
    region: "us-east-1",
    });
    
const ses=new AWS.SES({apiVersion:"2010-12-01"})
exports.register =async (req, res) => {
    console.log(process.env.AWS_REGION)
    console.log('REGISTER CONTROLLER', req.body);
    const {email,password,name,categories}=req.body;
    const user=await User.find({email});
    if(user)
    {
        const link =JWT.sign({email,password,name,categories},process.env.ACTIVATE_EMAIL,{
            expiresIn:"10m"
        })

        const params={
            Source:process.env.EMAIL_FROM,
            Destination:{ToAddresses:[email]},
            ReplyToAddresses:[process.env.EMAIL_TO],
            Message:{
                Body:{
                    Html:{
                        Charset:"UTF-8",
                        Data:`<html>
                                <body>
                                <h1>verify your email</h1>
                                <p>use the link below</p>
                                <p>${process.env.CLIENT_URL}/auth/activate/${link}</p>
                                </body>
                        </html>`
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
            res.status(200).json(`please check your box of email ${email} to compelet the registration`);
    
        }).catch(error=>{
            console.log("error ",error)
            res.status(400).json(`we couldn't verfiy this email ${email}`);
    
        })
    }
    else
    {
        res.status(400).json("the user is found");
    }

};

exports.registerActivate=(req,res)=>{
    try{
        const { token } = req.body;
    // console.log(token);
    JWT.verify(token, process.env.ACTIVATE_EMAIL, async function(err, decoded) {
        if (err) {
            return res.status(401).json({
                error: 'Expired link. Try again'
            });
        }

        const { name, email, password,categories } = JWT.decode(token);
        const username = shortId.generate();
        const foundUser=await User.findOne({email});
        if(foundUser)
        {
            res.status(401).json({
                error: 'Email is taken'
            });
        }
        else
        {
            const newUser = await  User.create({ username, name, email, password ,categories});
            if(newUser)
            {
                res.status(200).json("your email is activated");
            }
            else
            {
                res.status(400).json("there is an error in database please try later");
            }
        }
    });
    }
    catch(error)
    {
        res.status(400).json("the user is found");
    }
}


exports.userLogin=async (req,res)=>
{
    try{
        const { email, password } = req.body;
        console.log("user",email)
        const user=await User.findOne({email});
        if(user)
        {
            if(user.authenticate(password))
            {
                const token = JWT.sign({ _id: user._id }, process.env.LOGIN_USER, { expiresIn: '10d' });
                const { _id, name, email, role } = user;
        
                res.status(200).json({
                    token,
                    user: { _id, name, email, role }
                });
            }
            else
            {
                res.status(400).json("the data doesn't match ")
            }
        }
        else{
            res.status(404).json("the user not found")
        }
    }
    catch(error)
    {
        res.status(400).json("error in server please try later ")
    }
   
}



exports.forgotPassword = async(req, res) => {
    const { email } = req.body;
    // check if user exists with that email
    const user=await User.findOne({email})
    if(!user)
    {
        res.status(400).json({
            error: 'the user is not found'
        });
    }
    else
    {
        const token = JWT.sign({ name: user.name }, process.env.LOGIN_USER, { expiresIn: '10m' });
        // send email
        // user.resetPasswordLink=token;
        await User.findByIdAndUpdate(user._id,{resetPasswordLink:token})
        // await user.save();
        const params={
            Source:process.env.EMAIL_FROM,
            Destination:{ToAddresses:[email]},
            ReplyToAddresses:[process.env.EMAIL_TO],
            Message:{
                Body:{
                    Html:{
                        Charset:"UTF-8",
                        Data:`<html>
                                <body>
                                <h1>verify your email</h1>
                                <p>use the link below</p>
                                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                                </body>
                        </html>`
                    }
                },
                Subject:{
                    Charset:"UTF-8",
                    Data:"complete reset password"
                }
            }
        };
        const sendEmail= ses.sendEmail(params).promise();
        sendEmail.then(data=>{
            console.log("emial is sent "+data)
            res.status(200).json(`please check your box of email ${email} to compelet the registration`);
    
        }).catch(error=>{
            console.log("error ",error)
            res.status(400).json(`we couldn't verfiy this email ${email}`);
    
        })

    }
};

exports.resetPassword = async(req, res) => {
    const { resetPasswordLink, newPassword } = req.body;
    if (resetPasswordLink) {
        // check for expiry
        JWT.verify(resetPasswordLink, process.env.LOGIN_USER, async(err, success) => {
            if (err) {
                return res.status(400).json({
                    error: 'Expired Link. Try again.'
                });
            }
            const user=await User.findOne({resetPasswordLink });
            if(!user)
            {
                return res.status(400).json({
                    error: 'Invalid token. Try again'
                });
            }
            else
            {
                user.resetPasswordLink="";
                user.password=newPassword;
                user.save((err, result) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Password reset failed. Try again'
                        });
                    }

                    res.json({
                        message: `Great! Now you can login with your new password`
                    });
                });
            }
        })
    }
};
