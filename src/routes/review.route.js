const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const {deleteReviewById, updateReviewById, getReviewsByProductId, createReviewandRating } = require("../controllers/review.controller");

const ROLES = require("../utils/roles.util");

router.post( "/:productId/review", authMiddleware, roleMiddleware(ROLES.USER), createReviewandRating);

router.get("/:productId/review", getReviewsByProductId);

router.put("/:productId/review", authMiddleware,roleMiddleware(ROLES.USER),updateReviewById);

router.delete("/:productId/review", authMiddleware, roleMiddleware(ROLES.USER, ROLES.ADMIN), deleteReviewById );

module.exports = router;
