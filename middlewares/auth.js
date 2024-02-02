const jwt = require("jsonwebtoken");
const User = require("../models/user");
exports.authenticate = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    let user = jwt.verify(token, process.env.SECRET_KEY);
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized User!",
      });
    }
    console.log(token, user.id, user.name);
    let usr = await User.findByPk(user.id);
    req.user = usr;
    next();
  } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong",
    });
    console.log(error);
  }
};
