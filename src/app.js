import express from "express";
import AlunoRoutes from "./app/routes/AlunoRoutes.js";
import cors from "cors";

const app = express();
const port = 4001;

app.use(cors({
  origin: ["http://localhost:3000","http://192.168.0.30:3000","http://192.168.0.30:3000"],
  methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/alunos", AlunoRoutes);

app.listen(4001, () => console.log("Servidor rodando em 4001"));


export default app; // ✅ export default
