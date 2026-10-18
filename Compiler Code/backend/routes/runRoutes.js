const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const runController = require("../controllers/runController");

router.post("/", authMiddleware, runController.runCode);

module.exports = router;
