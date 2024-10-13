let currentPage = 1;
const resultsPerPage = 10; // Quantidade de resultados por página
let allResults = []; // Armazenará todos os trabalhos

document.addEventListener('DOMContentLoaded', function() {
    // Fazer uma requisição ao backend para buscar todos os trabalhos
    fetch('/api/trabalhos')
        .then(response => response.json())
        .then(trabalhos => {
            allResults = trabalhos; // Armazena todos os trabalhos
            console.log('Total de resultados:', allResults.length);
            renderTable(currentPage); // Exibe a primeira página
        })
        .catch(error => {
            console.error('Erro ao buscar trabalhos:', error);
            alert('Erro ao carregar trabalhos. Por favor, tente novamente mais tarde.');
        });
});

// Função para renderizar a tabela com base na página atual
function renderTable(page) {
    console.log('Renderizando página:', page);
    const trabalhosTable = document.getElementById('trabalhosTable').getElementsByTagName('tbody')[0];
    trabalhosTable.innerHTML = ''; // Limpa o conteúdo anterior

    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = page * resultsPerPage;
    const trabalhosPagina = allResults.slice(startIndex, endIndex); // Seleciona os trabalhos para a página atual

    // Renderiza os trabalhos na tabela
    trabalhosPagina.forEach(trabalho => {
        const row = trabalhosTable.insertRow();
        row.insertCell(0).textContent = trabalho.titulo;
        row.insertCell(1).textContent = trabalho.tipo_trabalho;
        row.insertCell(2).textContent = new Date(trabalho.data_publicacao).toLocaleDateString('pt-BR');

        const destaqueLabel = trabalho.destaque ? "Remover Destaque" : "Destacar";
        const actionCell = row.insertCell(3);
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

    renderPagination(); // Exibe os botões de paginação
}

// Função para renderizar os botões de paginação
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Limpa os botões anteriores

    const totalPages = Math.ceil(allResults.length / resultsPerPage);
    console.log('Total de páginas:', totalPages);

    // Botão "Anterior"
    if (currentPage > 1) {
        const prevButton = document.createElement('li');
        prevButton.classList.add('page-item');
        prevButton.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
        prevButton.addEventListener('click', function() {
            currentPage--;
            renderTable(currentPage);
        });
        pagination.appendChild(prevButton);
    }

    // Botões numéricos
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('li');
        pageButton.classList.add('page-item');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageButton.addEventListener('click', function() {
            currentPage = i;
            renderTable(currentPage);
        });
        pagination.appendChild(pageButton);
    }

    // Botão "Próximo"
    if (currentPage < totalPages) {
        const nextButton = document.createElement('li');
        nextButton.classList.add('page-item');
        nextButton.innerHTML = `<a class="page-link" href="#">Próximo</a>`;
        nextButton.addEventListener('click', function() {
            currentPage++;
            renderTable(currentPage);
        });
        pagination.appendChild(nextButton);
    }
}

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
