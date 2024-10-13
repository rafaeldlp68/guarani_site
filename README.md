# Guarani Site

Este repositório contém o código fonte para o site **Guarani Site**, que permite o cadastro, pesquisa e gestão de trabalhos acadêmicos.

## Funcionalidades Principais

- **Cadastro de Usuários**: Permite o registro de novos usuários com diferentes tipos (aluno, professor, etc.).
- **Login e Autenticação**: Sistema de login com proteção de senha via hash.
- **Cadastro de Trabalhos Acadêmicos**: Usuários podem cadastrar trabalhos como monografias, dissertações, teses e artigos.
- **Pesquisa Avançada**: Filtros avançados para busca de trabalhos com base em título, autor, ano, categoria e qualis.
- **Sistema de Destaques**: Trabalhos podem ser destacados para fácil visualização.
- **Gerenciamento Admin**: Administradores têm permissão para gerenciar todos os trabalhos e usuários.

## Pré-requisitos

Certifique-se de que você tenha instalado:

- **Node.js** (versão X.X.X ou superior)
- **MySQL** (versão X.X.X ou superior)
- **NPM** (gerenciador de pacotes do Node)

## Instalação

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/seu-usuario/guarani_site.git
   ```

2. **Instale as dependências do Node.js**:

   No diretório principal do projeto, execute:

   ```bash
   npm install
   ```

3. **Configuração do Banco de Dados**:

   - Certifique-se de ter o MySQL rodando.
   - Crie um banco de dados chamado `guaranifinal` (ou o nome especificado no código).
   - Execute o seguinte script SQL para criar as tabelas necessárias:

   ```sql
   CREATE DATABASE guaranifinal;
   USE guaranifinal;

   CREATE TABLE usuarios (
     id INT AUTO_INCREMENT PRIMARY KEY,
     nome VARCHAR(255) NOT NULL,
     ra_matricula VARCHAR(50) NOT NULL,
     instituicao VARCHAR(255),
     email VARCHAR(255) NOT NULL,
     senha_hash VARCHAR(255) NOT NULL,
     tipo_usuario ENUM('aluno', 'professor', 'admin') NOT NULL
   );

   CREATE TABLE trabalhos (
     id INT AUTO_INCREMENT PRIMARY KEY,
     tipo_trabalho ENUM('monografia', 'dissertacao', 'tese', 'artigo') NOT NULL,
     titulo VARCHAR(255) NOT NULL,
     subtitulo VARCHAR(255),
     autores JSON NOT NULL,
     palavras_chave JSON NOT NULL,
     data_publicacao DATE NOT NULL,
     resumo TEXT NOT NULL,
     link_publicacao VARCHAR(255) NOT NULL,
     usuario_id INT NOT NULL,
     curso VARCHAR(255),
     area_conhecimento VARCHAR(255),
     revista VARCHAR(255),
     qualis ENUM('A1', 'A2', 'B1', 'B2', 'B3', 'B4', 'B5', 'C'),
     destaque TINYINT DEFAULT 0,
     FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
   );
   ```

4. **Configuração de Ambiente**:

   - Renomeie o arquivo `.env.example` para `.env`.
   - Configure as variáveis de ambiente no arquivo `.env`, incluindo as credenciais do banco de dados.

5. **Iniciar o servidor**:

   ```bash
   npm start
   ```

   O servidor estará rodando em `http://localhost:3000`.

## Estrutura do Projeto

```bash
├── src
│   ├── frontend    # Contém todos os arquivos frontend (HTML, CSS, JS)
│   └── backend     # Contém todos os arquivos backend (Rotas, modelos, etc)
├── package.json    # Gerenciamento de dependências e scripts
├── README.md       # Instruções do projeto
└── server.js       # Arquivo principal do servidor Node.js
```

## Funcionalidades

### 1. Cadastro de Usuários

- Endpoint: `POST /api/cadastro`
- Descrição: Registra um novo usuário no sistema.

### 2. Login

- Endpoint: `POST /api/login`
- Descrição: Autenticação de usuários com email e senha.

### 3. Cadastro de Trabalhos Acadêmicos

- Endpoint: `POST /api/trabalhos`
- Descrição: Permite o cadastro de monografias, dissertações, teses e artigos.

### 4. Pesquisa de Trabalhos

- Endpoint: `GET /api/pesquisar`
- Parâmetros: Filtros opcionais como `autor`, `titulo`, `qualis`, `ano_inicial`, `ano_final`, entre outros.

### 5. Destaque de Trabalhos

- Endpoint: `POST /api/trabalhos/destacar`
- Descrição: Permite que o administrador destaque um trabalho específico.

### 6. Remover Destaque

- Endpoint: `POST /api/trabalhos/remover-destaque`
- Descrição: Remove o destaque de um trabalho acadêmico.

## Contribuindo

Se você deseja contribuir com o projeto:

1. **Fork o repositório**
2. **Crie uma nova branch** (`git checkout -b feature-nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push a branch** (`git push origin feature-nova-funcionalidade`)
5. **Crie um Pull Request**

## Licença

Este projeto está licenciado sob a licença MIT.
