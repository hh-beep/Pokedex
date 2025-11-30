// favoritos.js
document.addEventListener('DOMContentLoaded', () => {
  const favoritosList = document.getElementById('Favoritos_List');
  const vazioEl = document.getElementById('Favoritos_Vazio');

  // Função para atualizar a exibição
  function atualizarExibicao() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (favoritos.length === 0) {
      vazioEl.style.display = 'block';
      favoritosList.innerHTML = '';
      return;
    }

    vazioEl.style.display = 'none';
    favoritosList.innerHTML = '';

    favoritos.forEach(pokemon => {
      const nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      const sprite = `https://img.pokemondb.net/sprites/black-white/normal/${pokemon.name}.png`;

      const li = document.createElement('li');
      li.classList.add('main_List__Card', 'Favoritos_Card');
      li.innerHTML = `
        <div class="main_List__Card-Top">
          <p class="main_List__Card-Top--Index">#${String(pokemon.id).padStart(3, '0')}</p>
          <button class="Favoritos_Card--Remover main_List__Card-Top--Icon" data-name="${pokemon.name}" title="Remover dos favoritos">
            <!-- Você pode usar um ícone SVG ou emoji -->
            <img class="main_List__Card-Top--IconImage" src="./assets/icon_star.svg" alt="Remover" style="filter: brightness(0) saturate(100%) invert(85%) sepia(90%) saturate(1000%) hue-rotate(360deg);">
          </button>
        </div>
        <figure class="main_List__Image">
          <img class="main_List__Image-Img" src="${sprite}" alt="${nome}" onerror="this.src='./assets/pokeball.png'">
        </figure>
        <section class="main_List__Section">
          <p class="main_List__Section-Text">${nome}</p>
        </section>
      `;

      // Clique no card → ver detalhes
      li.addEventListener('click', async (e) => {
        if (e.target.closest('.Favoritos_Card--Remover')) return; // ignora clique no botão
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
          if (!res.ok) throw new Error('Pokémon não encontrado');
          const data = await res.json();
          localStorage.setItem('Pokemon', JSON.stringify(data));
          window.location.href = './pokemon.html';
        } catch (err) {
          alert('Não foi possível carregar os dados deste Pokémon.');
        }
      });

      // Clique no botão de remover
      const btnRemover = li.querySelector('.Favoritos_Card--Remover');
      btnRemover.addEventListener('click', (e) => {
        e.stopPropagation();

        // Remove do localStorage
        let lista = JSON.parse(localStorage.getItem('favoritos')) || [];
        lista = lista.filter(p => p.name !== pokemon.name);
        localStorage.setItem('favoritos', JSON.stringify(lista));

        // Atualiza a lista visualmente
        atualizarExibicao();
      });

      favoritosList.appendChild(li);
    });
  }

  // Inicializa a lista
  atualizarExibicao();
});