const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const fileController = require("../controllers/fileController");

router.use(authMiddleware);

router.get("/:projectId/files", fileController.getFiles);
router.post("/:projectId/files", fileController.createFile);
router.put("/:projectId/files/:fileId", fileController.updateFile);
router.put("/:projectId/files/:fileId/rename", fileController.renameItem);
router.delete("/:projectId/files/:fileId", fileController.deleteItem);

module.exports = router;
