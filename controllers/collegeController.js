const College = require("../models/college");

exports.getAllColleges = async (req, res) => {
  try {
    const {
      limit = 10,
      lastId,
      sortBy = "name",
      degrees,
      state,
      city,
      type,
      popularity,
    } = req.query;

    const query = {};
    if (degrees) query.degrees = { $in: degrees.split(",") };
    if (state) query["location.state"] = state;
    if (city) query["location.city"] = city;
    if (type) query.type = type;
    if (popularity) query.popularity = popularity;

    if (lastId) {
      query._id = { $gt: lastId };
    }

    const colleges = await College.find(query)
      .sort({ [sortBy]: 1, _id: 1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      colleges,
      lastId: colleges.length ? colleges[colleges.length - 1]._id : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .select(
        "name location degrees coursesOffered yearOfEstablishment type feesRange highestPackage popularity ratings admissionDetails scholarships gallery reviews website campusFacilities placementStats contactInfo"
      )
      .populate("reviews.user", "name") 
      .lean();

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCollege = async (req, res) => {
  const collegeData = req.body;

  const college = new College(collegeData);
  try {
    const newCollege = await college.save();
    res.status(201).json(newCollege);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!college) return res.status(404).json({ message: "College not found" });
    res.status(200).json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    res.status(200).json({ message: "College deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findById(id).populate("reviews.user", "name");

    if (!college) return res.status(404).json({ message: "College not found" });

    res.status(200).json(college.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.flagReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const college = await College.findById(id);
    if (!college) return res.status(404).json({ message: "College not found" });

    const review = college.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.flagged = true;
    await college.save();

    res.status(200).json({ message: "Review flagged for moderation" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { collegeId, reviewId } = req.params;

    const college = await College.findById(collegeId);
    if (!college) {
      console.log(`College with ID ${collegeId} not found`);
      return res.status(404).json({ message: "College not found" });
    }

    const review = college.reviews.id(reviewId);
    if (!review) {
      console.log(
        `Review with ID ${reviewId} not found for college ${collegeId}`
      );
      return res.status(404).json({ message: "Review not found" });
    }

    college.reviews.pull({ _id: reviewId });

    await college.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

exports.getFlaggedReviews = async (req, res) => {
  try {
    const flaggedReviews = await College.aggregate([
      { $match: { "reviews.flagged": true } },
      {
        $project: {
          name: 1,
          location: 1,
          reviews: {
            $filter: {
              input: "$reviews",
              as: "review",
              cond: { $eq: ["$$review.flagged", true] },
            },
          },
        },
      },
    ]);

    if (flaggedReviews.length === 0) {
      return res.status(404).json({ message: "No flagged reviews found" });
    }

    res.status(200).json(flaggedReviews);
  } catch (error) {
    console.error("Error fetching flagged reviews:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

exports.approveFlaggedReview = async (req, res) => {
  const { collegeId, reviewId } = req.params;

  try {
    const college = await College.findById(collegeId);
    if (!college) return res.status(404).json({ message: "College not found" });

    const review = college.reviews.id(reviewId);
    if (!review || !review.flagged)
      return res.status(404).json({ message: "Flagged review not found" });

    review.flagged = false;
    await college.save();

    res.status(200).json({ message: "Review approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const inappropriateWords = ["spam", "fake", "abuse"];

exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewText, rating } = req.body;
    const userId = req.user.userId;

    const isInappropriate = inappropriateWords.some((word) =>
      reviewText.includes(word)
    );
    const college = await College.findById(id);
    if (!college) return res.status(404).json({ message: "College not found" });

    college.reviews.push({
      user: userId,
      reviewText,
      rating,
      flagged: isInappropriate,
    });

    await college.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
