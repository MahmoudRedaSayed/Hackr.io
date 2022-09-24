exports.getUserInfo=async(req,res)=>{
    req.profile.hashed_password=undefined;
    req.profile.salt=undefined;
    res.status(200).json(req.profile);
}