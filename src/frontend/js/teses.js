document.addEventListener('DOMContentLoaded', function() {
    // Variáveis de controle de paginação para as teses recentes
    let currentPageRecentes = 1;
    const resultsPerPage = 5; // Quantidade de resultados por página
    let allRecentes = [];

    // Buscar destaques de teses
    fetch('/api/trabalhos/destacados?tipo=tese')  // Filtrando por teses
        .then(response => response.json())
        .then(destaques => {
            exibirDestaques(destaques, 'destaques-container'); // Exibe os destaques sem paginação
        })
        .catch(error => console.error('Erro ao buscar destaques:', error));

    // Buscar teses recentes com paginação
    fetch('/api/trabalhos/filtrar?tipo=tese&ordenacao=data_desc')  // Ordenação por data
        .then(response => response.json())
        .then(recentes => {
            allRecentes = recentes; // Armazena todas as teses recentes
            exibirPaginaRecentes(currentPageRecentes); // Exibe a primeira página
        })
        .catch(error => console.error('Erro ao buscar teses recentes:', error));

    // Função para exibir destaques (sem paginação)
    function exibirDestaques(destaques, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Limpa o conteúdo anterior

        if (destaques.length === 0) {
            container.innerHTML = '<p>Nenhuma tese destacada encontrada.</p>';
            return;
        }

        destaques.forEach(trabalho => {
            const cardHTML = `
                <div class="card me-3" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${trabalho.titulo}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${trabalho.subtitulo}</h6>
                        <p class="card-text">${trabalho.resumo}</p>
                        <p class="card-author">Autor: ${trabalho.autores.join(', ')}</p>
                        <a href="${trabalho.link_publicacao}" class="card-link">Saiba mais</a>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    }

    // Função para exibir as teses recentes com paginação
    function exibirPaginaRecentes(page) {
        const tbody = document.getElementById('teses-recentes-table-body');
        tbody.innerHTML = ''; // Limpa os resultados anteriores

        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = page * resultsPerPage;
        const recentesPagina = allRecentes.slice(startIndex, endIndex);

        if (recentesPagina.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Nenhuma tese recente encontrada.</td></tr>';
            return;
        }

        recentesPagina.forEach(tese => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tese.titulo}</td>
                <td>${tese.autores.join(', ')}</td>
                <td>${new Date(tese.data_publicacao).toLocaleDateString('pt-BR')}</td>
                <td><a href="${tese.link_publicacao}" target="_blank">Ver Trabalho</a></td>
            `;
            tbody.appendChild(row);
        });

        exibirControlesPaginacao(allRecentes.length, currentPageRecentes);
    }

    // Função para exibir controles de paginação
    function exibirControlesPaginacao(totalResults, currentPage) {
        const paginationDiv = document.getElementById('recentes-pagination');
        paginationDiv.innerHTML = ''; // Limpa a navegação anterior

        const totalPages = Math.ceil(totalResults / resultsPerPage);

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Anterior';
            prevButton.addEventListener('click', () => {
                currentPage--;
                exibirPaginaRecentes(currentPage);
            });
            paginationDiv.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.disabled = i === currentPage;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                exibirPaginaRecentes(currentPage);
            });
            paginationDiv.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Próximo';
            nextButton.addEventListener('click', () => {
                currentPage++;
                exibirPaginaRecentes(currentPage);
            });
            paginationDiv.appendChild(nextButton);
        }
    }
});
