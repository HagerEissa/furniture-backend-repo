const express = require("express");
const router = express.Router();

const ROLES = require("../utils/roles.util");
const upload = require("../config/multerConfig");

const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middleware"); 

const { updateProfile, getUsers, updateRole, deleteUser,} = require("../controllers/user.controller");


router.put("/profile", authMiddleware, upload.single("file"), updateProfile);

router.get("/", authMiddleware, roleMiddleware(ROLES.ADMIN), getUsers);

router.put("/:id/role", authMiddleware, roleMiddleware(ROLES.ADMIN) , updateRole);

router.delete("/:id", authMiddleware, roleMiddleware(ROLES.ADMIN), deleteUser);

module.exports = router;
