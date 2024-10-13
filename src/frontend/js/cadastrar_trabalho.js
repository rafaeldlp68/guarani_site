document.addEventListener('DOMContentLoaded', function() {
    const cadastrarTrabalhoForm = document.getElementById('cadastrarTrabalhoForm');

    cadastrarTrabalhoForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o envio padrão do formulário

        // Pega os dados do formulário
        const tipo_trabalho = document.getElementById('tipo_trabalho').value;
        const area_conhecimento = document.getElementById('area_conhecimento').value; // Captura o campo área de conhecimento
        const curso = document.getElementById('curso').value; // Captura o campo curso
        const titulo = document.getElementById('titulo').value;
        const subtitulo = document.getElementById('subtitulo').value;
        const autores = document.getElementById('autores').value.split(',').map(autor => autor.trim());
        const palavras_chave = document.getElementById('palavras_chave').value.split(',').map(palavra => palavra.trim());
        const data_publicacao = document.getElementById('data_publicacao').value; // Alterado para data_publicacao
        const resumo = document.getElementById('resumo').value;
        const revista = document.getElementById('revista').value; // Captura o campo revista
        const qualis = document.getElementById('qualis').value; // Captura o campo qualis
        const link_publicacao = document.getElementById('link_publicacao').value;
        const usuario_id = localStorage.getItem('usuario_id'); // Pega o usuario_id do localStorage

        // Envia os dados para a API usando fetch
        fetch('/api/trabalhos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo_trabalho,
                area_conhecimento, 
                curso, 
                titulo,
                subtitulo,
                autores,
                palavras_chave,
                data_publicacao,
                resumo,
                revista,
                qualis,
                link_publicacao,
                usuario_id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Exibe a mensagem de sucesso ou erro
                if (data.message === 'Trabalho acadêmico cadastrado com sucesso!') {
                    cadastrarTrabalhoForm.reset(); // Reseta o formulário
                }
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar o trabalho:', error);
        });
    });
});
