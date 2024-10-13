document.addEventListener('DOMContentLoaded', function() {
    const usuario_id = localStorage.getItem('usuario_id');

    // Fazer uma requisição ao backend para buscar os trabalhos do usuário
    fetch(`/api/trabalhos/usuario?usuario_id=${usuario_id}`)
        .then(response => response.json())
        .then(trabalhos => {
            const trabalhosTable = document.getElementById('trabalhosTable').getElementsByTagName('tbody')[0];

            // Para cada trabalho, criar uma linha na tabela
            trabalhos.forEach(trabalho => {
                const row = trabalhosTable.insertRow();

                // Adicionar os dados do trabalho nas células
                row.insertCell(0).textContent = trabalho.titulo;
                row.insertCell(1).textContent = trabalho.tipo_trabalho;
                row.insertCell(2).textContent = trabalho.data_publicacao;

                // Adicionar botões de edição e exclusão
                const actionCell = row.insertCell(3);
                actionCell.innerHTML = `
                    <button class="btn btn-info btn-sm" onclick="editarTrabalho(${trabalho.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirTrabalho(${trabalho.id})">Excluir</button>
                `;
            });
        })
        .catch(error => {
            console.error('Erro ao buscar trabalhos:', error);
        });
});

// Função para excluir o trabalho
function excluirTrabalho(id) {
    if (confirm('Tem certeza que deseja excluir este trabalho?')) {
        fetch(`/api/trabalhos/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); // Recarrega a página para atualizar a lista
        })
        .catch(error => {
            console.error('Erro ao excluir o trabalho:', error);
        });
    }
}

// Função para editar o trabalho
function editarTrabalho(id) {
    // Redirecionar para uma página de edição com o ID do trabalho na URL
    window.location.href = `editar_trabalho.html?id=${id}`;
}
