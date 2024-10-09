document.addEventListener('DOMContentLoaded', function() {
    // Fazer a requisição para obter trabalhos destacados
    fetch('/api/trabalhos/destacados')
        .then(response => response.json())
        .then(trabalhos => {
            // Filtrar e exibir trabalhos por categoria
            exibirTrabalhosDestacados(trabalhos, 'monografia', '#monografias-container');
            exibirTrabalhosDestacados(trabalhos, 'artigo', '#artigos-container');
            exibirTrabalhosDestacados(trabalhos, 'dissertacao', '#dissertacoes-container');
            exibirTrabalhosDestacados(trabalhos, 'tese', '#teses-container');
        })
        .catch(error => {
            console.error('Erro ao buscar trabalhos destacados:', error);
        });
});

// Função para exibir trabalhos destacados em cada seção
function exibirTrabalhosDestacados(trabalhos, tipoTrabalho, sectionSelector) {
    const section = document.querySelector(sectionSelector);
    const trabalhosFiltrados = trabalhos.filter(trabalho => trabalho.tipo_trabalho === tipoTrabalho);

    trabalhosFiltrados.forEach(trabalho => {
        const cardHTML = `
            <div class="card me-3" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${trabalho.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${trabalho.subtitulo}</h6>
                    <p class="card-text">${trabalho.resumo}</p>
                    <p class="card-author">Autor: ${trabalho.autores.join(', ')}</p>
                    <a href="${trabalho.link_publicacao}" class="card-link">Saiba mais</a>
                    <a href="${trabalho.link_publicacao}" class="card-link">Link da revista</a>
                </div>
            </div>
        `;

        section.innerHTML += cardHTML;
    });
}
