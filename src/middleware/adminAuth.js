const adminAuth = (req, res, next) => {
  if (req.user && req.user.isAdmin == true) {
    console.log(req.user);
    return next();
  }
  else{
    return res.status(401).send({
      msg: 'You dont have admin access'
    });
  }
};

module.exports = adminAuth;
