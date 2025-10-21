const express = require("express");
const passport = require("passport");
const router = express.Router();
const { googleCallback, facebookCallback } = require("../controllers/oauth.controller");

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), googleCallback);

router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login", session: false }), facebookCallback);

module.exports = router;
