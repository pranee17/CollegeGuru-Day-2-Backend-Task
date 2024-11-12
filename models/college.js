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
      type: String,
      required: true,
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
      enum: ["Public", "Private"],
      required: true,
    },
    feesRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    highestPackage: {
      type: String, 
    },
    popularity: {
      type: String,
      enum: ["Popular", "Standard", "New"],
      default: "Standard",
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("College", collegeSchema);
