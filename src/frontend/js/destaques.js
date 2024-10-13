document.addEventListener('DOMContentLoaded', function() {
    // Fazer a requisição para obter trabalhos destacados por categoria
    fetch('/api/trabalhos/destacados?tipo=monografia')
        .then(response => response.json())
        .then(trabalhos => {
            exibirTrabalhosDestacados(trabalhos, '#monografias-container');
        })
        .catch(error => {
            console.error('Erro ao buscar trabalhos destacados de monografias:', error);
        });

    fetch('/api/trabalhos/destacados?tipo=artigo')
        .then(response => response.json())
        .then(trabalhos => {
            exibirTrabalhosDestacados(trabalhos, '#artigos-container');
        })
        .catch(error => {
            console.error('Erro ao buscar trabalhos destacados de artigos:', error);
        });

    fetch('/api/trabalhos/destacados?tipo=dissertacao')
        .then(response => response.json())
        .then(trabalhos => {
            exibirTrabalhosDestacados(trabalhos, '#dissertacoes-container');
        })
        .catch(error => {
            console.error('Erro ao buscar trabalhos destacados de dissertações:', error);
        });

    fetch('/api/trabalhos/destacados?tipo=tese')
        .then(response => response.json())
        .then(trabalhos => {
            exibirTrabalhosDestacados(trabalhos, '#teses-container');
        })
        .catch(error => {
            console.error('Erro ao buscar trabalhos destacados de teses:', error);
        });
});

// Função para exibir trabalhos destacados em cada seção
function exibirTrabalhosDestacados(trabalhos, sectionSelector) {
    const section = document.querySelector(sectionSelector);
    section.innerHTML = ''; // Limpa a seção antes de inserir os destaques

    if (trabalhos.length === 0) {
        section.innerHTML = '<p>Nenhum destaque encontrado.</p>';
        return;
    }

    trabalhos.forEach(trabalho => {
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
        section.innerHTML += cardHTML;
    });
}
