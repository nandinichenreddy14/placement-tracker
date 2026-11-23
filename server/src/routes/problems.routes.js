import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  listProblems,
  createProblem,
  getProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/problems.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", listProblems);
router.post("/", createProblem);
router.get("/:id", getProblem);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);

export default router;
