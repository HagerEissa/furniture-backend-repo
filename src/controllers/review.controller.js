const Review = require("../models/review.model");
const Product = require("../models/product.model");

exports.createReviewandRating = async (req, res) => {
  const { comment, rating } = req.body;
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5." });

    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview)
      return res.status(400).json({ message: "You already reviewed this product." });

    const review = await Review.create({ userId, productId, comment, rating });
    product.reviewId.push(review._id);

    const oldAverage = product.averageRating || 0;
    const numOfReviews = product.numOfReviews || 0;

    const newAverage =
      (oldAverage * numOfReviews + rating) / (numOfReviews + 1);

    product.averageRating = newAverage;
    product.numOfReviews = numOfReviews + 1;

    await product.save();

    const reviewWithUser = await Review.findById(review._id).populate("userId","name email");

    res.status(201).json({message: "Review added successfully",review: reviewWithUser,averageRating: newAverage,});
  } catch (error) {
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

    const reviews = await Review.find({ productId }).populate("userId","name email");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReviewById = async (req, res) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    const review = await Review.findOne({ productId, userId });

    if (!product || !review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const oldRating = review.rating;

    review.comment = comment || review.comment;
    if (rating) review.rating = rating;
    await review.save();

    if (rating) {
      const oldAverage = product.averageRating || 0;
      const numOfReviews = product.numOfReviews || 0;

      let newAverage = 0;

      if (numOfReviews > 0) {
        newAverage = (oldAverage * numOfReviews - oldRating + rating) / numOfReviews;
      } else {
        newAverage = rating;
      }

      if (!isFinite(newAverage)) newAverage = rating;
      if (newAverage > 5) newAverage = 5;
      if (newAverage < 0) newAverage = 0;

      product.averageRating = newAverage;
      await product.save();
    }

    res.status(200).json({message: "Review updated successfully",review,averageRating: product.averageRating});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReviewById = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === "ADMIN";

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let review;
    if (isAdmin) {
      const { reviewId } = req.body;
      review = await Review.findById(reviewId);
    } else {
      review = await Review.findOne({ productId, userId });
    }

    if (!review) return res.status(404).json({ message: "Review not found" });

    await Review.findByIdAndDelete(review._id);
    await Product.findByIdAndUpdate(productId, {
      $pull: { reviewId: review._id },
    });

    const oldAverage = product.averageRating || 0;
    const numOfReviews = product.numOfReviews || 0;
    const deletedRating = review.rating;

    let newAverage = 0;
    let newCount = numOfReviews - 1;

    if (newCount > 0) {
      newAverage = (oldAverage * numOfReviews - deletedRating) / newCount;
    }

    product.averageRating = newAverage;
    product.numOfReviews = newCount;

    await product.save();

    res.status(200).json({message: "Review deleted successfully",averageRating: newAverage});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};