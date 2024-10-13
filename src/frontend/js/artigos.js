document.addEventListener('DOMContentLoaded', function() {
    // Variáveis de controle de paginação para os artigos recentes
    let currentPageRecentes = 1;
    const resultsPerPage = 5; // Quantidade de resultados por página
    let allRecentes = [];

    // Buscar destaques de artigos
    fetch('/api/trabalhos/destacados?tipo=artigo')  // Filtrando por artigos
        .then(response => response.json())
        .then(destaques => {
            exibirDestaques(destaques, 'destaques-container'); // Exibe os destaques sem paginação
        })
        .catch(error => console.error('Erro ao buscar destaques:', error));

    // Buscar artigos recentes com paginação
    fetch('/api/trabalhos/filtrar?tipo=artigo&ordenacao=data_desc')  // Ordenação por data
        .then(response => response.json())
        .then(recentes => {
            allRecentes = recentes; // Armazena todos os artigos recentes
            exibirPaginaRecentes(currentPageRecentes); // Exibe a primeira página
        })
        .catch(error => console.error('Erro ao buscar artigos recentes:', error));

    // Função para exibir destaques (sem paginação)
    function exibirDestaques(destaques, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Limpa o conteúdo anterior

        if (destaques.length === 0) {
            container.innerHTML = '<p>Nenhum destaque encontrado.</p>';
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

    // Função para exibir os artigos recentes com paginação
    function exibirPaginaRecentes(page) {
        const tbody = document.getElementById('artigos-recentes-table-body');
        tbody.innerHTML = ''; // Limpa os resultados anteriores

        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = page * resultsPerPage;
        const recentesPagina = allRecentes.slice(startIndex, endIndex);

        if (recentesPagina.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Nenhum artigo recente encontrado.</td></tr>';
            return;
        }

        recentesPagina.forEach(artigo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${artigo.titulo}</td>
                <td>${artigo.autores.join(', ')}</td>
                <td>${new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')}</td>
                <td><a href="${artigo.link_publicacao}" target="_blank">Ver Trabalho</a></td>
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
