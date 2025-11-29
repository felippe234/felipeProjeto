import express from "express";
import AlunoController from "../controller/AlunoController.js";

const router = express.Router();

// Rotas da tabela "Aluno"
router.get("/", AlunoController.index);
router.get("/:id", AlunoController.show);
router.post("/", AlunoController.store);
router.put("/:id", AlunoController.update);
router.patch("/:id", AlunoController.patch);

router.delete("/:id", AlunoController.delete);

export default router;
