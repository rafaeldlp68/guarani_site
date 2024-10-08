const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Para suportar JSON no body das requisições

// Configurações do banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SenhaTeste123!',
  database: 'guaranifinal'
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

// Middleware para servir arquivos estáticos do frontend
app.use(express.static('src/frontend'));

// Rota para verificar se o servidor está funcionando
app.get('/api', (req, res) => {
  res.send({ message: 'API funcionando!' });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Rota de cadastro de usuários
app.post('/api/cadastro', async (req, res) => {
    const { nome, ra_matricula, instituicao, email, senha, tipo_usuario } = req.body;
  
    // Validações simples (pode adicionar mais conforme necessário)
    if (!nome || !ra_matricula || !email || !senha || !tipo_usuario) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
  
    try {
      // Hash da senha para armazenar de forma segura
      const senhaHash = await bcrypt.hash(senha, 10);
  
      // Query para inserir o novo usuário
      const query = `INSERT INTO usuarios (nome, ra_matricula, instituicao, email, senha_hash, tipo_usuario) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [nome, ra_matricula, instituicao, email, senhaHash, tipo_usuario];
  
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Erro ao cadastrar o usuário:', err);
          return res.status(500).json({ message: 'Erro ao cadastrar o usuário.' });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
      });
  
    } catch (err) {
      console.error('Erro ao processar o cadastro:', err);
      res.status(500).json({ message: 'Erro no cadastro.' });
    }
  });

// Rota de cadastro de trabalhos acadêmicos
app.post('/api/trabalhos', (req, res) => {
  const { tipo_trabalho, area_conhecimento, titulo, subtitulo, autores, palavras_chave, data_submissao, resumo, link_publicacao, usuario_id } = req.body;

  // Validações simples
  if (!tipo_trabalho || !area_conhecimento || !titulo || !autores || !palavras_chave || !data_submissao || !resumo || !link_publicacao || !usuario_id) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Query para inserir o trabalho acadêmico
  const query = `INSERT INTO trabalhos (tipo_trabalho, area_conhecimento, titulo, subtitulo, autores, palavras_chave, data_submissao, resumo, link_publicacao, usuario_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [tipo_trabalho, area_conhecimento, titulo, subtitulo, JSON.stringify(autores), JSON.stringify(palavras_chave), data_submissao, resumo, link_publicacao, usuario_id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar o trabalho:', err);
      return res.status(500).json({ message: 'Erro ao cadastrar o trabalho.' });
    }
    res.status(201).json({ message: 'Trabalho acadêmico cadastrado com sucesso!' });
  });
});


// Rota para obter todos os usuários
app.get('/api/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuários:', err);
        return res.status(500).json({ message: 'Erro ao buscar usuários.' });
      }
  
      res.json(results);
    });
  });

// Rota para obter todos os trabalhos acadêmicos de um usuário
app.get('/api/trabalhos', (req, res) => {
  const { usuario_id } = req.query;

  if (!usuario_id) {
      return res.status(400).json({ message: 'Usuário não especificado.' });
  }

  const query = 'SELECT * FROM trabalhos WHERE usuario_id = ?';

  db.query(query, [usuario_id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar trabalhos:', err);
      return res.status(500).json({ message: 'Erro ao buscar trabalhos.' });
    }

    res.json(results);
  });
});

// Rota para excluir um trabalho acadêmico
app.delete('/api/trabalhos/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM trabalhos WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir o trabalho:', err);
      return res.status(500).json({ message: 'Erro ao excluir o trabalho.' });
    }

    res.json({ message: 'Trabalho acadêmico excluído com sucesso!' });
  });
});

// Rota de pesquisa de trabalhos acadêmicos
app.get('/api/pesquisar', (req, res) => {
  const { categoria, area_conhecimento, data_inicio, autor } = req.query;

  // Exibir os parâmetros no console para debugar
  console.log('Parâmetros de pesquisa:', { categoria, area_conhecimento, data_inicio, autor });

  // Construir a query dinâmica com base nos filtros
  let query = 'SELECT * FROM trabalhos WHERE 1=1';
  const values = [];

  if (categoria) {
      query += ' AND tipo_trabalho = ?';
      values.push(categoria);
  }

  if (area_conhecimento) {
      query += ' AND area_conhecimento = ?';
      values.push(area_conhecimento);
  }

  if (data_inicio) {
      query += ' AND data_submissao >= ?';
      values.push(data_inicio);
  }

  if (autor) {
      query += ' AND autores LIKE ?';
      values.push(`%${autor}%`);
  }

  // Executar a query no banco de dados
  db.query(query, values, (err, results) => {
      if (err) {
          console.error('Erro ao buscar trabalhos:', err);
          return res.status(500).json({ message: 'Erro ao buscar trabalhos.' });
      }

      res.json(results);
  });
});



// Rota de login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  // Verificar se o usuário existe
  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar o usuário:', err);
      return res.status(500).json({ message: 'Erro no login.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    const usuario = results[0];

    // Comparar a senha fornecida com o hash armazenado
    const match = await bcrypt.compare(senha, usuario.senha_hash);
    if (!match) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    res.json({ message: 'Login bem-sucedido!', usuario });
  });
});
