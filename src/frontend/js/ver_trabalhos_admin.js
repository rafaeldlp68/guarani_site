document.addEventListener('DOMContentLoaded', function() {
    // Fazer uma requisição ao backend para buscar todos os trabalhos
    fetch('/api/trabalhos')
        .then(response => response.json())
        .then(trabalhos => {
            const trabalhosTable = document.getElementById('trabalhosTable').getElementsByTagName('tbody')[0];

            // Limpa o conteúdo anterior
            trabalhosTable.innerHTML = '';

            // Para cada trabalho, criar uma linha na tabela
            trabalhos.forEach(trabalho => {
                const row = trabalhosTable.insertRow();

                // Adicionar os dados do trabalho nas células
                row.insertCell(0).textContent = trabalho.titulo;
                row.insertCell(1).textContent = trabalho.tipo_trabalho;
                row.insertCell(2).textContent = trabalho.data_submissao;

                // Verificar se o trabalho está destacado
                const destaqueLabel = trabalho.destaque ? "Remover Destaque" : "Destacar";
                const actionCell = row.insertCell(3);

                // Adicionar botões de edição, exclusão e destaque/remover destaque
                actionCell.innerHTML = `
                    <button class="btn btn-info btn-sm" onclick="editarTrabalho(${trabalho.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirTrabalho(${trabalho.id})">Excluir</button>
                    <button class="btn btn-warning btn-sm" onclick="alterarDestaqueTrabalho(${trabalho.id}, ${trabalho.destaque})">${destaqueLabel}</button>
                `;

                // Mudar a cor da linha se o trabalho estiver destacado (opcional)
                if (trabalho.destaque) {
                    row.style.backgroundColor = '#ffffcc'; // Exemplo de cor amarela clara
                }
            });
        })
        .catch(error => {
            console.error('Erro ao buscar trabalhos:', error);
            alert('Erro ao carregar trabalhos. Por favor, tente novamente mais tarde.');
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
            alert('Erro ao excluir o trabalho. Tente novamente mais tarde.');
        });
    }
}

// Função para editar o trabalho
function editarTrabalho(id) {
    window.location.href = `editar_trabalho.html?id=${id}`;
}

// Função para destacar ou remover o destaque do trabalho
function alterarDestaqueTrabalho(id, destaqueAtual) {
    const action = destaqueAtual ? 'remover o destaque' : 'destacar';
    if (confirm(`Tem certeza que deseja ${action} este trabalho?`)) {
        const url = destaqueAtual ? '/api/trabalhos/remover-destaque' : '/api/trabalhos/destacar';
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trabalho_id: id })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); // Recarrega a página para atualizar a lista
        })
        .catch(error => {
            console.error(`Erro ao ${action} o trabalho:`, error);
            alert(`Erro ao ${action} o trabalho. Tente novamente mais tarde.`);
        });
    }
}
