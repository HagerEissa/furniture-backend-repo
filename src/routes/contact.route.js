const express = require("express");
const router = express.Router();

const ROLES = require("../utils/roles.util");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const { sendMessage, getMessage, deleteMessage } = require("../controllers/contact.controller");


router.post("/", authMiddleware, roleMiddleware(ROLES.USER), sendMessage);

router.get("/", authMiddleware, roleMiddleware(ROLES.ADMIN), getMessage);

router.delete("/:messageId", authMiddleware, roleMiddleware(ROLES.ADMIN), deleteMessage);


module.exports = router;