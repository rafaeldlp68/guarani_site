document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        // Capturar os valores dos filtros
        const categoria = document.getElementById('categoria').value;
        const areaConhecimento = document.getElementById('area-conhecimento').value;
        const dataInicio = document.getElementById('data').value;
        const autor = document.getElementById('autor').value;

        // Criar a URL com os parâmetros de busca
        const queryString = `?categoria=${categoria}&area_conhecimento=${areaConhecimento}&data_inicio=${dataInicio}&autor=${autor}`;

        // Fazer a requisição GET para o backend com os parâmetros
        fetch(`/api/pesquisar${queryString}`)
            .then(response => response.json())
            .then(data => {
                // Exibir os resultados da pesquisa
                console.log(data); // Para verificar os resultados no console
                exibirResultados(data);
            })
            .catch(error => {
                console.error('Erro ao buscar os trabalhos:', error);
            });
    });
});

// Função para exibir os resultados da pesquisa
function exibirResultados(trabalhos) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; // Limpa os resultados anteriores

    // Verifica se o resultado é uma array
    if (!Array.isArray(trabalhos)) {
        resultadosDiv.innerHTML = '<p>Erro: O formato da resposta não é válido.</p>';
        return;
    }

    if (trabalhos.length === 0) {
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
            <th>Data de Submissão</th>
            <th>Link</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    trabalhos.forEach(trabalho => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trabalho.titulo}</td>
            <td>${trabalho.autores.join(', ')}</td>
            <td>${trabalho.tipo_trabalho}</td>
            <td>${trabalho.data_submissao}</td>
            <td><a href="${trabalho.link_publicacao}" target="_blank">Ver Trabalho</a></td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultadosDiv.appendChild(table);
}
