const Category = require('../models/category');
const slugify = require('slugify');
const formidable = require('formidable');
const {v4:uuidv4} = require('uuid');
const AWS = require('aws-sdk');
const fs = require('fs');

// s3

const s3=new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: "us-east-1",
    });

exports.create = (req, res) => {
    console.log("call function")
    const { name, image, content } = req.body;
    console.log({ name, image, content });
    // image data
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = image.split(';')[0].split('/')[1];

    const slug = slugify(name);
    let category = new Category({ name, content, slug });

    const params = {
        Bucket: 'react-aws-node-bucket',
        Key: `category/${uuidv4()}.${type}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).json({ error: 'Upload to s3 failed' });
        }
        console.log('AWS UPLOAD RES DATA', data);
        category.image.url = data.Location;
        category.image.key = data.Key;
        // posted by
        category.postedBy = req.auth._id;

        // save to db
        category.save((err, success) => {
            if (err) {
                console.log(err);
                res.status(400).json({ error: 'Duplicate category' });
            }
            return res.json(success);
        });
    });
};


exports.list = (req, res) => {
    Category.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Categories could not load'
            });
        }
        res.json(data);
    });
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
