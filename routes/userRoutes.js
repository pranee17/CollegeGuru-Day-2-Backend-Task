const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");


router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.delete("/profile", authenticate, userController.deleteProfile);

router.get("/all-users", authenticate, authorize("admin"), userController.getAllUsers);

module.exports = router;
