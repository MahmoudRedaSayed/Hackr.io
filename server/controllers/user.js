const Link=require("../models/link");
const User=require("../models/user")
exports.getUserInfo=async(req,res)=>{
    Link.find({ postedBy: req.profile })
    .populate('categories', 'name slug')
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 })
    .exec((err, links) => {
        if (err) {
            return res.status(400).json({
                error: 'Could not find links'
            });
        }
        req.profile.hashed_password=undefined;
        req.profile.salt=undefined;
        // console.log("links is",links)
        res.json({ user:req.profile, links });
    })
}

exports.update = (req, res) => {
    const { name, password, categories } = req.body;
    switch (true) {
        case password && password.length < 6:
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
            break;
    }

    User.findOneAndUpdate({ _id: req.profile._id }, { name, password, categories }, { new: true }).exec((err, updated) => {
        if (err) {
            return res.staus(400).json({
                error: 'Could not find user to update'
            });
        }
        updated.hashed_password = undefined;
        updated.salt = undefined;
        res.json(updated);
    });
};