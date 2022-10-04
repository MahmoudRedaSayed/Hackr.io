const Link = require('../models/link');
const slugify = require('slugify');
const { findByIdAndUpdate } = require('../models/user');

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
    });
};

exports.list = (req, res) => {
    Link.find({}).exec((err, data) => {
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