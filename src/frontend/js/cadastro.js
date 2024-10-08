document.getElementById('cadastroUsuarioForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Pega os dados dos campos do formulário
    const nome = document.getElementById('nome').value;
    const ra_matricula = document.getElementById('ra_matricula').value;
    const instituicao = document.getElementById('instituicao').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const tipo_usuario = document.getElementById('tipo_usuario').value;

    // Envia os dados para a API usando fetch
    fetch('/api/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            ra_matricula,
            instituicao,
            email,
            senha,
            tipo_usuario
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message); // Exibe a mensagem de sucesso ou erro
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar:', error);
    });
});
