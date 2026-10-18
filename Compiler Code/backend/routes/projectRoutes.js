const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const projectController = require("../controllers/projectController");

router.use(authMiddleware);

router.get("/", projectController.getProjects);
router.post("/", projectController.createProject);
router.get("/:id", projectController.getProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);
router.post("/:id/duplicate", projectController.duplicateProject);

module.exports = router;
