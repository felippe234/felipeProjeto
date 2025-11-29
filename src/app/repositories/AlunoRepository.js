import conexao from "../database/conexao.js";

class AlunoRepository {
  // 🔍 Buscar todos os alunos
  async listarTodos() {
    const [rows] = await conexao.execute("SELECT * FROM Aluno");
    return rows;
  }

  // 🔍 Buscar aluno por ID
  async buscarPorId(id) {
    const [rows] = await conexao.execute("SELECT * FROM Aluno WHERE id = ?", [id]);
    return rows[0];
  }

  // 🆕 Criar novo aluno
  async criar(aluno) {
    // ✅ Inserir sem 'id' nem 'matricula'
    const [result] = await conexao.execute(
      `INSERT INTO Aluno 
       (nome, data_nascimento, email, telefone, endereco, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        aluno.nome,
        aluno.data_nascimento,
        aluno.email,
        aluno.telefone,
        aluno.endereco,
        aluno.status || "ativo"
      ]
    );

    // ✅ Gerar matrícula com base no ID
    const novoId = result.insertId;
    const matricula = 1000 + novoId;

    // ✅ Atualizar matrícula no banco
    await conexao.execute(
      `UPDATE Aluno SET matricula = ? WHERE id = ?`,
      [matricula, novoId]
    );

    // ✅ Retornar aluno criado
    return {
      id: novoId,
      matricula,
      nome: aluno.nome,
      data_nascimento: aluno.data_nascimento,
      email: aluno.email,
      telefone: aluno.telefone,
      endereco: aluno.endereco,
      status: aluno.status || "ativo"
    };
  }

  // ✏️ Atualizar aluno existente
  async atualizar(id, aluno) {
    const [result] = await conexao.execute(
      `UPDATE Aluno 
       SET nome = ?, data_nascimento = ?, email = ?, telefone = ?, endereco = ?, status = ? 
       WHERE id = ?`,
      [
        aluno.nome,
        aluno.data_nascimento,
        aluno.email,
        aluno.telefone,
        aluno.endereco,
        aluno.status || "ativo",
        id
      ]
    );
    return result.affectedRows;
  }

  // ✏️ Atualização parcial (PATCH)
async patch(id, campos) {
  // Monta dinamicamente o SQL conforme os campos enviados
  const chaves = Object.keys(campos);
  if (chaves.length === 0) return 0; // nada a atualizar

  const valores = Object.values(campos);
  const setClause = chaves.map((col) => `${col} = ?`).join(", ");

  const [result] = await conexao.execute(
    `UPDATE Aluno SET ${setClause} WHERE id = ?`,
    [...valores, id]
  );

  return result.affectedRows;
}


  // 🗑️ Deletar aluno
  async deletar(id) {
    const [result] = await conexao.execute("DELETE FROM Aluno WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

export default new AlunoRepository();
