const express = require("express");
const auth = require("../middleware/auth");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.use(auth);

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
