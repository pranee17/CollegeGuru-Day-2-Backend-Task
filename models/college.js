const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
    },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    degrees: [
      {
        type: String,
        enum: ["BTech", "MTech", "BArch", "Diploma", "Doctorate"],
      },
    ],
    coursesOffered: [
      {
        type: String,
        enum: [
          "Engineering",
          "Management",
          "Commerce & Banking",
          "Medical",
          "Sciences",
          "Hotel Management",
          "Information Technology",
          "Arts & Humanities",
          "Mass Communication",
          "Nursing",
          "Agriculture",
          "Design",
          "Law",
          "Pharmacy",
          "Para Medical",
          "Dental",
          "Performing Arts",
          "Education",
        ],
      },
    ],
    yearOfEstablishment: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Public", "Private", "Private UnAided"],
      required: true,
    },
    feesRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    highestPackage: {
      type: String,  
      required: true,
    },
    popularity: {
      type: String,
      enum: ["Popular", "Standard", "New"],
      default: "Standard",
    },
    ratings: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
    admissionDetails: {
      ugCourses: String,
      pgCourses: String,
      phdCourses: String,
      admissionTestDates: String,
      applicationDeadline: String,
    },
    scholarships: {
      type: Boolean,
      default: false,
    },
    gallery: [
      {
        url: String,
        description: String,
      },
    ],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewText: String,
        rating: { type: Number, min: 0, max: 5 },
        flagged: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    website: { type: String },              
    campusFacilities: [String],            
    placementStats: {
      totalPlaced: Number,
      placementPercentage: Number,
    },
    contactInfo: {
      phone: String,
      email: String,
      address: String,
    },
    counselingAvailability: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

collegeSchema.index({ name: 1 });
collegeSchema.index({ "location.state": 1, "location.city": 1 });
collegeSchema.index({ degrees: 1 });
collegeSchema.index({ "reviews.flagged": 1 });
collegeSchema.index({ "location.state": 1, degrees: 1 });

module.exports = mongoose.model("College", collegeSchema);
