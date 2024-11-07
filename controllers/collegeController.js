const College = require("../models/college");

exports.getAllColleges = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "name",
      degrees,
      location,
    } = req.query;

    const query = {};
    if (degrees) query.degrees = { $in: degrees.split(",") };
    if (location) query.location = location;

    const colleges = await College.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalColleges = await College.countDocuments(query);

    res.status(200).json({
      total: totalColleges,
      page: Number(page),
      totalPages: Math.ceil(totalColleges / limit),
      colleges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });
    res.status(200).json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCollege = async (req, res) => {
  const college = new College(req.body);
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

exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewText, rating } = req.body;
    const userId = req.user.userId;

    const college = await College.findById(id);
    if (!college) return res.status(404).json({ message: "College not found" });

    college.reviews.push({ user: userId, reviewText, rating });
    await college.save();

    res.status(201).json({ message: "Review added successfully" });
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
