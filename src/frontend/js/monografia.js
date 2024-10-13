document.addEventListener('DOMContentLoaded', function() {
    // Buscar destaques de monografias
    fetch('/api/trabalhos/destacados?tipo=monografia')  // Filtrando por monografia
        .then(response => response.json())
        .then(destaques => {
            exibirDestaques(destaques, 'destaques-container'); // Exibe apenas destaques de monografias
        })
        .catch(error => console.error('Erro ao buscar destaques:', error));

    // Buscar monografias recentes
    fetch('/api/trabalhos/filtrar?tipo=monografia&ordenacao=data_desc') // Alterando para a rota de filtragem correta
        .then(response => response.json())
        .then(recentes => {
            exibirMonografiasRecentes(recentes); // Exibe as monografias mais recentes
        })
        .catch(error => console.error('Erro ao buscar monografias recentes:', error));

    // Função para exibir os destaques (formato de cards)
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
                        <a href="${trabalho.link_publicacao}" class="card-link">Link da revista</a>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });
    }

    // Função para exibir monografias recentes (formato de tabela)
    function exibirMonografiasRecentes(monografias) {
        const tbody = document.getElementById('monografias-recentes-table-body');
        tbody.innerHTML = ''; // Limpa os resultados anteriores

        if (monografias.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Nenhuma monografia recente encontrada.</td></tr>';
            return;
        }

        monografias.forEach(monografia => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${monografia.titulo}</td>
                <td>${monografia.autores.join(', ')}</td>
                <td>${new Date(monografia.data_publicacao).toLocaleDateString('pt-BR')}</td>
                <td><a href="${monografia.link_publicacao}" target="_blank">Ver Trabalho</a></td>
            `;
            tbody.appendChild(row);
        });
    }
});
