const express = require("express");
const router = express.Router();

const upload = require("../config/multerConfig");

const { register, login } = require("../controllers/auth.controller");

router.post("/register", upload.single("avatar"),register);

router.post("/login", login);

module.exports = router;
