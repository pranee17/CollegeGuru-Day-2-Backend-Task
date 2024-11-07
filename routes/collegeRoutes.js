const express = require("express");
const router = express.Router();
const collegeController = require("../controllers/collegeController");
const authenticate = require("../middleware/auth");

router.get("/", collegeController.getAllColleges);
router.get("/:id", collegeController.getCollegeById);
router.post("/", collegeController.createCollege);
router.put("/:id", collegeController.updateCollege);
router.delete("/:id", collegeController.deleteCollege);

router.post("/:id/reviews", authenticate, collegeController.addReview);
router.get("/:id/reviews", collegeController.getReviews);

module.exports = router;
