const { generateToken } = require("../utils/jwt.util");

exports.googleCallback = (req, res) => {
    const token = generateToken({ id: req.user._id });
    res.redirect(`http://localhost:4200/oauth-success?token=${token}`);
};

exports.facebookCallback = (req, res) => {
    const token = generateToken({ id: req.user._id });
    res.redirect(`http://localhost:4200/oauth-success?token=${token}`);
};
