const Link = require('../models/link');
const User=require("../models/user");
const Category=require("../models/category");
const AWS=require("aws-sdk")
const slugify = require('slugify');
const { findByIdAndUpdate } = require('../models/user');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: "us-east-1",
    });
    
const ses=new AWS.SES({apiVersion:"2010-12-01"})
exports.create = (req, res) => {
    const { title, url, categories, type, medium } = req.body;
    // console.table({ title, url, categories, type, medium });
    const slug = url;
    let link = new Link({ title, url, categories, type, medium, slug });
    // posted by user
    link.postedBy = req.auth._id;
    // save link
    link.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Link already exist'
            });
        }
        res.json(data);
        User.find({ categories: { $in: categories } }).exec((err, users) => {
            if (err) {
                throw new Error(err);
                console.log('Error finding users to send email on link publish');
            }
            Category.find({ _id: { $in: categories } }).exec((err, result) => {
                data.categories = result;

                for (let i = 0; i < users.length; i++) {
                    const params={
                        Source:process.env.EMAIL_FROM,
                        Destination:{ToAddresses:[users[i].email]},
                        ReplyToAddresses:[process.env.EMAIL_TO],
                        Message:{
                            Body:{
                                Html:{
                                    Charset:"UTF-8",
                                    Data:`<html>
                                    <h1>New link published</h1>
                                    <p>A new link titled <b>${
                                        data.title
                                    }</b> has been just publihsed in the following categories.</p>
                                    
                                    ${data.categories
                                        .map(c => {
                                            return `
                                            <div>
                                                <h2>${c.name}</h2>
                                                <img src="${c.image.url}" alt="${c.name}" style="height:50px;" />
                                                <h3><a href="${process.env.CLIENT_URL}/links/${c.slug}">Check it out!</a></h3>
                                            </div>
                                        `;
                                        })
                                        .join('-----------------------')}
        
                                    <br />
        
                                    <p>Do not wish to receive notifications?</p>
                                    <p>Turn off notification by going to your <b>dashboard</b> > <b>update profile</b> and <b>uncheck the categories</b></p>
                                    <p>${process.env.CLIENT_URL}/user/profile/update</p>
        
                                </html>`
                                }
                            },
                            Subject:{
                                Charset:"UTF-8",
                                Data:"new link is published"
                            }
                        }
                    };
                    const sendEmail = ses.sendEmail(params).promise();

                    sendEmail
                        .then(success => {
                            console.log('email submitted to SES ', success);
                            return;
                        })
                        .catch(failure => {
                            console.log('error on email submitted to SES  ', failure);
                            return;
                        });
                }
            });
        });
    });
};

exports.list = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    Link.find({}).populate('postedBy', 'name')
    .populate('categories', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not list links'
            });
        }
        res.json(data);
    });
};


exports.clickCount = async (req, res) => {
    try {
        const { linkId } = req.body;
        console.log("link is id",linkId);
        const link=await Link.findByIdAndUpdate(linkId,{$inc: {clicks:1}  });
        console.log(link)
        res.status(200).json(link);
    }
    catch(error)
    {
        res.status(400).json("couldn't inc the clicks")
    }

};

exports.read = async(req, res) => {
    const { id } = req.params;
    console.log("the id of the link",id)
    try{
        const link=await Link.findById(id);
        res.json(link)
    }
    catch(error)
    {
        res.status(400).json({
            error: 'Error finding link'
        });
    }
};

exports.update = async(req, res) => {
    const { id } = req.params;
    const { title, url, categories, type, medium } = req.body;
    const updatedLink = { title, url, categories, type, medium };
    console.log("update link",id)
    try{

        const updated=await Link.findByIdAndUpdate(id,updatedLink);
        res.status(200).json(updated);

    }
    catch(error)
    {
        console.log(error);
        res.status(400).json({
            error: 'Error updating the link'
        });
    }
};

exports.remove = async (req, res) => {
    const { id } = req.params;
    try{
        console.log("the id of the link",id)
        await Link.findByIdAndDelete(id);
        console.log("the link is deleted")
        res.status(200).json("the link is deleted")
    }
    catch(error)
    {
        res.status(400).json("error in deleting the link")
    }
    
};

exports.popular = (req, res) => {
    console.log("from the popular in cates")
    Link.find()
        .populate('postedBy', 'name')
        .sort({ clicks: -1 })
        .limit(3)
        .exec((err, links) => {
            if (err) {
                return res.status(400).json({
                    error: 'Links not found'
                });
            }
            res.json(links);
        });
};

exports.popularInCategory = (req, res) => {
    const { slug } = req.params;
    console.log("from the most popular",slug);
    Category.findOne({ slug }).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not load categories'
            });
        }

        Link.find({ categories: category })
            .sort({ clicks: -1 })
            .limit(3)
            .exec((err, links) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Links not found'
                    });
                }
                res.json(links);
            });
    });
};
