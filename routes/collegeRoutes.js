const express = require("express");
const router = express.Router();
const collegeController = require("../controllers/collegeController");
const authenticate = require("../middleware/auth");


router.get("/flagged-reviews", authenticate, collegeController.getFlaggedReviews);
router.get("/", collegeController.getAllColleges);
router.get("/:id", collegeController.getCollegeById);
router.post("/", collegeController.createCollege);
router.put("/:id", collegeController.updateCollege);
router.delete("/:id", collegeController.deleteCollege);

router.post("/:id/reviews", authenticate, collegeController.addReview);
router.get("/:id/reviews", collegeController.getReviews);


router.put("/:id/reviews/:reviewId/flag", authenticate, collegeController.flagReview);

router.delete('/:collegeId/reviews/:reviewId', collegeController.deleteReview);

router.put("/:collegeId/reviews/:reviewId/approve", authenticate, collegeController.approveFlaggedReview)


module.exports = router;
