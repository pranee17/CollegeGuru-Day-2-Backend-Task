const express = require("express");
const router = express.Router();
const collegeController = require("../controllers/collegeController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");



router.get("/flagged-reviews", authenticate, authorize("admin"), collegeController.getFlaggedReviews);


router.post("/", authenticate, authorize("admin"), collegeController.createCollege);
router.put("/:id", authenticate, authorize("admin"), collegeController.updateCollege);
router.delete("/:id", authenticate, authorize("admin"), collegeController.deleteCollege);


router.get("/", collegeController.getAllColleges);
router.get("/:id", collegeController.getCollegeById);


router.post("/:id/reviews", authenticate, collegeController.addReview);
router.get("/:id/reviews", authenticate, collegeController.getReviews);


router.put("/:id/reviews/:reviewId/flag", authenticate, authorize("admin"), collegeController.flagReview);
router.put("/:collegeId/reviews/:reviewId/approve", authenticate, authorize("admin"), collegeController.approveFlaggedReview);
router.delete("/:collegeId/reviews/:reviewId", authenticate, authorize("admin"), collegeController.deleteReview);

module.exports = router;
