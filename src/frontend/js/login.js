document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    // Pega os dados do formulário
    const email = document.getElementById('username').value;
    const senha = document.getElementById('password').value;

    // Envia os dados para a API de login
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Exibe os dados recebidos no console do navegador
        if (data.message === 'Login bem-sucedido!') {
            // Armazenar informações no localStorage
            localStorage.setItem('nome', data.usuario.nome);
            localStorage.setItem('tipo_usuario', data.usuario.tipo_usuario);
            localStorage.setItem('usuario_id', data.usuario.id); // Armazena o ID do usuário no localStorage

            // Redireciona o usuário para a página perfil
            window.location.href = 'perfil.html';
        } else {
            alert('Erro no login: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao efetuar login:', error);
    });
});
