import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as companyController from "./company.controller";

const router = Router();

router.post("/", authenticate, ...companyController.create);
router.get("/me", authenticate, ...companyController.getMine);
router.get("/:id", companyController.getById);
router.patch("/:id", authenticate, ...companyController.update);
router.delete("/:id", authenticate, ...companyController.remove);

export default router;