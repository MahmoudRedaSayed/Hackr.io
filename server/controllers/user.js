const Link=require("../models/link");
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