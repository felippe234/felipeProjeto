import AlunoRepository from "../repositories/AlunoRepository.js";

class AlunoController {
  async index(req, res) {
    try {
      const alunos = await AlunoRepository.listarTodos();
      res.status(200).json(alunos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao buscar alunos" });
    }
  }

  async show(req, res) {
    const { id } = req.params;
    try {
      const aluno = await AlunoRepository.buscarPorId(id);
      if (!aluno) return res.status(404).json({ msg: "Aluno não encontrado" });
      res.status(200).json(aluno);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao buscar aluno" });
    }
  }

  async store(req, res) {
    // ❌ Removido 'id' da desestruturação
    const { nome, data_nascimento, email, telefone, endereco, status } = req.body;

    // ✅ Validação sem 'id'
    if (!nome || !data_nascimento || !email) {
      return res.status(400).json({
        erro: "Campos obrigatórios: nome, data_nascimento, email"
      });
    }

    try {
      // ✅ Envia apenas os campos necessários
      const novoAluno = await AlunoRepository.criar({
        nome,
        data_nascimento,
        email,
        telefone,
        endereco,
        status
      });
      res.status(201).json(novoAluno);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao cadastrar aluno" });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { nome, data_nascimento, email, telefone, endereco, status } = req.body;

    if (!nome || !data_nascimento || !email) {
      return res.status(400).json({
        erro: "Campos obrigatórios: nome, data_nascimento, email"
      });
    }

    try {
      const linhasAfetadas = await AlunoRepository.atualizar(id, {
        nome,
        data_nascimento,
        email,
        telefone,
        endereco,
        status
      });
      if (linhasAfetadas === 0)
        return res.status(404).json({ msg: "Aluno não encontrado" });
      res.status(200).json({ id, nome, data_nascimento, email, telefone, endereco, status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao atualizar aluno" });
    }
  }
  // 🔹 PATCH - Atualização parcial
async patch(req, res) {
  const { id } = req.params;
  const campos = req.body;

  if (!id) return res.status(400).json({ erro: "ID do aluno é obrigatório" });

  try {
    const linhasAfetadas = await AlunoRepository.patch(id, campos);
    if (linhasAfetadas === 0)
      return res.status(404).json({ msg: "Aluno não encontrado" });

    res.status(200).json({ msg: "Aluno atualizado com sucesso", campos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar parcialmente o aluno" });
  }
}


  async delete(req, res) {
    const { id } = req.params;
    try {
      const linhasAfetadas = await AlunoRepository.deletar(id);
      if (linhasAfetadas === 0)
        return res.status(404).json({ msg: "Aluno não encontrado" });
      res.status(200).json({ msg: `Aluno ${id} excluído com sucesso!` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao excluir aluno" });
    }
  }
}

export default new AlunoController();
