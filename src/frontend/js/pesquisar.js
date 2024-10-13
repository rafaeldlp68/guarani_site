let currentPage = 1;
const resultsPerPage = 10; // Quantidade de resultados por página
let allResults = []; // Armazenará todos os resultados

document.addEventListener('DOMContentLoaded', function() {
    const categoria = document.getElementById('categoria');
    const areaConhecimento = document.getElementById('area-conhecimento');
    const autor = document.getElementById('autor');
    const titulo = document.getElementById('titulo');
    const anoInicial = document.getElementById('ano-inicial');
    const anoFinal = document.getElementById('ano-final');
    const revista = document.getElementById('revista');
    const qualis = document.getElementById('qualis');

    if (!categoria || !areaConhecimento || !autor || !titulo || !anoInicial || !anoFinal || !revista || !qualis) {
        console.error("Um ou mais elementos do formulário não foram encontrados no DOM.");
        return;
    }

    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = ''; // Limpa a paginação anterior

    const form = document.querySelector('form');

    // Função de aplicar filtros, chamada ao enviar o formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário
        aplicarFiltros();
    });

    function aplicarFiltros() {
        // Capturar os valores dos filtros
        const categoria = document.getElementById('categoria').value;
        const areaConhecimento = document.getElementById('area-conhecimento').value;
        const anoInicial = document.getElementById('ano-inicial').value;
        const anoFinal = document.getElementById('ano-final').value;
        const autor = document.getElementById('autor').value;
        const titulo = document.getElementById('titulo').value;
        const revista = document.getElementById('revista').value;
        const qualis = document.getElementById('qualis').value;

        // Criar a URL com os parâmetros de busca
        const queryString = `?categoria=${categoria}&area_conhecimento=${areaConhecimento}&ano_inicial=${anoInicial}&ano_final=${anoFinal}&autor=${autor}&titulo=${titulo}&revista=${revista}&qualis=${qualis}`;

        // Fazer a requisição GET para o backend com os parâmetros
        fetch(`/api/pesquisar${queryString}`)
            .then(response => response.json())
            .then(data => {
                allResults = data; // Armazena todos os resultados
                currentPage = 1; // Reinicia para a primeira página
                exibirPagina(currentPage); // Exibe a primeira página
            })
            .catch(error => {
                console.error('Erro ao buscar os trabalhos:', error);
            });
    }

    function exibirPagina(page) {
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores

        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = page * resultsPerPage;
        const resultadosPagina = allResults.slice(startIndex, endIndex);

        if (resultadosPagina.length === 0) {
            resultadosDiv.innerHTML = '<p>Nenhum trabalho encontrado.</p>';
            return;
        }

        // Criar uma lista ou tabela para exibir os trabalhos encontrados
        const table = document.createElement('table');
        table.classList.add('table', 'table-striped');

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Título</th>
                <th>Autor(es)</th>
                <th>Categoria</th>
                <th>Data de Publicação</th>
                <th>Link</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        resultadosPagina.forEach(trabalho => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${trabalho.titulo}</td>
                <td>${trabalho.autores.join(', ')}</td>
                <td>${trabalho.tipo_trabalho}</td>
                <td>${new Date(trabalho.data_publicacao).toLocaleDateString('pt-BR')}</td>
                <td><a href="${trabalho.link_publicacao}" target="_blank">Ver Trabalho</a></td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        resultadosDiv.appendChild(table);

        exibirControlesDePagina(); // Atualiza os controles de paginação
    }

    function exibirControlesDePagina() {
        const paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = ''; // Limpa a navegação anterior

        const totalPages = Math.ceil(allResults.length / resultsPerPage);

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Anterior';
            prevButton.addEventListener('click', () => {
                currentPage--;
                exibirPagina(currentPage);
            });
            paginationDiv.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.disabled = i === currentPage;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                exibirPagina(currentPage);
            });
            paginationDiv.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Próximo';
            nextButton.addEventListener('click', () => {
                currentPage++;
                exibirPagina(currentPage);
            });
            paginationDiv.appendChild(nextButton);
        }
    }
});
