require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user.model"); 


passport.use(
    new GoogleStrategy(
        {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL

        },
        async (accessToken, refreshToken, profile, done) => {
        const { displayName, emails, photos } = profile;
        const email = emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
            name: displayName,
            email,
            avatar: photos[0].value,
            password: null,
            loginMethod: "google",
            });
        }

        return done(null, user);
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
        clientID: process.env.FACEBOOK_CLIENT_ID ,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "emails", "photos"],
        },
        async (accessToken, refreshToken, profile, done) => {
        const { displayName, emails, photos } = profile;
        const email = emails?.[0]?.value;
        if (!email) return done(null, false);

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
            name: displayName,
            email,
            avatar: photos?.[0]?.value,
            password: null,
            loginMethod: "facebook",
            });
        }

        return done(null, user);
        }
    )
);
