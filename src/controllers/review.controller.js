const Review = require("../models/review.model");
const Product = require("../models/product.model");

exports.createReviewandRating = async (req, res) => {
    const { comment, rating } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (rating < 1 || rating > 5) {
        return res
            .status(400)
            .json({ message: "Rating must be between 1 and 5." });
        }

        const existingReview = await Review.findOne({ userId, productId });
        if (existingReview) {
        return res
            .status(400)
            .json({ message: "You have already reviewed this product." });
        }

        const review = await Review.create({ userId, productId, comment, rating });

        product.reviewId.push(review._id);

        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;

        product.averageRating = averageRating;
        product.numOfReviews = reviews.length;
        await product.save();

        const reviewWithUser = await Review.findById(review._id).populate(
        "userId",
        "username email"
        );

        res.status(200).json({
        message: "Review created successfully",
        review: reviewWithUser,
        averageRating,
        });
    } catch (error) {
        console.error("Error posting review:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getReviewsByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await Review.find({ productId }).populate(
      "userId",
      "username email"
    );

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateReviewById = async (req, res) => {
  try {
    const { productId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({ productId, userId }).sort({
      createdAt: -1,
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      review._id,
      {
        comment: comment || review.comment,
        rating: rating || review.rating,
      },
      { new: true }
    ).populate("userId", "username email");

    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating,
      numOfReviews: reviews.length,
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReviewById = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === "ADMIN";

  try {
    let review;

    if (isAdmin) {
      const { reviewId } = req.body;
      if (!reviewId)
        return res.status(400).json({ message: "reviewId is required for admin" });
      review = await Review.findById(reviewId);
    } else {
      review = await Review.findOne({ productId, userId });
    }

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const deletedReview = await Review.findByIdAndDelete(review._id);

    await Product.findByIdAndUpdate(productId, {
      $pull: { reviewId: review._id },
    });

    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating,
      numOfReviews: reviews.length,
    });

    res.status(200).json({
      message: "Review deleted successfully",
      deletedReview,
      averageRating,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: error.message });
  }
};
