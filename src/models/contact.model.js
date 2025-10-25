const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
        name:  {type: String , required: true},
        email: {type: String , required: true, match: [/^[\w.%+-]+@[\w.-]+\.[a-z]{2,}$/, "Please use a valid email address"]},
        message : {type: String , required: true}
    },
    { timestamps: true },
);

module.exports = mongoose.model("contact", contactSchema);