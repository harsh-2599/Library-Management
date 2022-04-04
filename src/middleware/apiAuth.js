const User = require('./../models/user');

const jwt = require('jsonwebtoken');

const apiAuth = async(req,res,next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ','')
    if(!token){
      return res.status(401).send({
        msg: 'Please Login Again'
    });
    }
    const decoded = jwt.verify(token,'secretKEY');
    req.user = decoded.user;
    const user = await User.findOne({_id : req.user._id})
    if(!user){
      return res.status(401).send({
        msg: 'No user found'
    });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).send({
      msg: 'Unable to authenticate'
  });
  }
}
module.exports = apiAuth;
