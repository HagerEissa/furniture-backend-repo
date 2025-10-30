const express = require("express");
const passport = require("passport");

const router = express.Router();
const { googleCallback, facebookCallback } = require("../controllers/oauth.controller");


router.get( "/auth/google",passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", (req, res, next) => {
    if (req.query.error) {return res.redirect("http://localhost:4200/login?error=cancelled");}
    passport.authenticate("google", { failureRedirect: "/login", session: false }, (err, user) => {
        if (err || !user) {
            return res.redirect("http://localhost:4200/login?error=failed");
        }
        req.user = user;
        googleCallback(req, res);
    })(req, res, next);
});


router.get("/auth/facebook",passport.authenticate("facebook", { scope: ["email"] }));

router.get("/auth/facebook/callback", (req, res, next) => {
    if (req.query.error) {
        return res.redirect("http://localhost:4200/login?error=cancelled");
    }
    passport.authenticate("facebook", { failureRedirect: "/login", session: false }, (err, user) => {
        if (err || !user) {
        return res.redirect("http://localhost:4200/login?error=failed");
        }
        req.user = user;
        facebookCallback(req, res);
    })(req, res, next);
});

module.exports = router;
