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

exports.read = (req, res) => {
    //
};

exports.update = (req, res) => {
    //
};

exports.remove = (req, res) => {
    //
};
