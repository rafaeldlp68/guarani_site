document.addEventListener('DOMContentLoaded', function() {
    // Recupera o nome e o tipo de usuário do localStorage
    const nome = localStorage.getItem('nome');
    const tipo_usuario = localStorage.getItem('tipo_usuario');

    // Atualiza a mensagem de boas-vindas e o tipo de usuário
    document.getElementById('welcomeMessage').textContent = `Bem-vindo, ${nome}!`;
    document.getElementById('userType').textContent = `Você está logado como ${tipo_usuario}.`;

    // Exibe botões baseados no tipo de usuário
    const actionButtons = document.getElementById('actionButtons');

    if (tipo_usuario === 'aluno') {
        actionButtons.innerHTML = `
            <a href="cadastrar_trabalho.html" class="btn btn-primary me-2">Cadastrar Trabalho</a>
            <a href="ver_trabalhos.html" class="btn btn-secondary">Ver Meus Trabalhos</a>
        `;
    } else if (tipo_usuario === 'professor') {
        actionButtons.innerHTML = `
            <a href="revisar_trabalhos.html" class="btn btn-info me-2">Revisar Trabalhos</a>
            <a href="ver_trabalhos.html" class="btn btn-secondary">Ver Meus Trabalhos</a>
        `;
    } else if (tipo_usuario === 'admin') {
        actionButtons.innerHTML = `
            <a href="cadastrar_trabalho.html" class="btn btn-primary me-2">Cadastrar Trabalho</a>
            <a href="gerenciar_usuarios.html" class="btn btn-warning me-2">Gerenciar Usuários</a>
            <a href="ver_trabalhos_admin.html" class="btn btn-secondary">Ver Todos os Trabalhos</a> <!-- Redireciona para uma nova página específica para admin -->
        `;
    }
});
