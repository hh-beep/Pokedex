// Função para obter o tipo da URL
function getTipoFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tipo')?.toLowerCase();
}

// Elementos do DOM
const tipoList = document.getElementById('Tipo_List');
const titleElement = document.querySelector('.main_Section__Tittle');
const botaoMais = document.getElementById('Tipo_ButtonMore');

// Estado
let currentTipo = null;
let allPokemonUrls = [];
let loadedCount = 0;
const limit = 20;

// ✅ Função de card com favoritos (mesmo comportamento da pokedex.html)
function criarCard(pokemon) {
  const id = pokemon.id;
  const nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const sprite = `https://img.pokemondb.net/sprites/black-white/normal/${pokemon.name}.png`;

  // Verifica se já está nos favoritos
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const isFavorito = favoritos.some(p => p.name === pokemon.name);

  const li = document.createElement('li');
  li.classList.add('main_List__Card', 'Pokedex_Card');
  li.innerHTML = `
    <div class="main_List__Card-Top">
      <p class="main_List__Card-Top--Index">#${String(id).padStart(3, '0')}</p>
      <button class="main_List__Card-Top--Icon ${isFavorito ? 'favoritado' : ''}" 
              data-name="${pokemon.name}" data-id="${id}" aria-label="${isFavorito ? 'Favoritado' : 'Favoritar'}">
        <img class="main_List__Card-Top--IconImage" src="./assets/icon_star.svg" alt="${isFavorito ? 'Favoritado' : 'Favoritar'}"/>
      </button>
    </div>
    <figure class="main_List__Image">
      <img class="main_List__Image-Img" src="${sprite}" alt="${nome}" />
    </figure>
    <section class="main_List__Section">
      <p class="main_List__Section-Text">${nome}</p>
    </section>
  `;

  const img = li.querySelector('.main_List__Image-Img');
  img.onerror = () => {
    img.src = pokemon.sprites?.front_default || 'https://via.placeholder.com/80?text=?';
  };

  // Clique no CARD → detalhes
  li.addEventListener('click', (e) => {
    if (e.target.closest('.main_List__Card-Top--Icon')) return; // ignora clique na estrela
    localStorage.setItem('Pokemon', JSON.stringify(pokemon));
    window.location.href = './pokemon.html';
  });

  // Clique na ESTRELA → favoritar/desfavoritar (sem redirecionar)
  const starBtn = li.querySelector('.main_List__Card-Top--Icon');
  starBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const name = starBtn.dataset.name;
    const currentId = starBtn.dataset.id;

    let lista = JSON.parse(localStorage.getItem('favoritos')) || [];
    const jaFavoritado = lista.some(p => p.name === name);

    if (!jaFavoritado) {
      // Adiciona
      lista.push({ name, id: currentId });
      starBtn.classList.add('favoritado');
      starBtn.querySelector('img').alt = 'Favoritado';
      starBtn.setAttribute('aria-label', 'Favoritado');
    } else {
      // Remove
      lista = lista.filter(p => p.name !== name);
      starBtn.classList.remove('favoritado');
      starBtn.querySelector('img').alt = 'Favoritar';
      starBtn.setAttribute('aria-label', 'Favoritar');
    }

    localStorage.setItem('favoritos', JSON.stringify(lista));
    // ✅ Nenhum redirecionamento aqui!
  });

  return li;
}

// Carrega um lote de Pokémon do tipo
async function carregarLote() {
  if (loadedCount >= allPokemonUrls.length) {
    if (botaoMais) {
      botaoMais.disabled = true;
      botaoMais.textContent = 'Fim';
    }
    return;
  }

  const loteUrls = allPokemonUrls.slice(loadedCount, loadedCount + limit);
  const pokemons = [];

  try {
    for (const url of loteUrls) {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        pokemons.push(data);
      }
    }

    pokemons.forEach(pkm => {
      tipoList.appendChild(criarCard(pkm));
    });

    loadedCount += pokemons.length;

    if (loadedCount >= allPokemonUrls.length && botaoMais) {
      botaoMais.disabled = true;
      botaoMais.textContent = 'Fim';
    }

  } catch (err) {
    console.error('Erro ao carregar Pokémon:', err);
    alert('Erro ao carregar os dados. Verifique sua conexão.');
  }
}

// Inicializa o tipo
async function inicializarTipo(tipo) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${tipo}/`);
    if (!res.ok) throw new Error('Tipo não encontrado');

    const data = await res.json();

    if (titleElement) {
      const nomeTipo = tipo.charAt(0).toUpperCase() + tipo.slice(1);
      titleElement.textContent = `Pokémons do tipo: ${nomeTipo}`;
    }

    allPokemonUrls = data.pokemon.map(p => p.pokemon.url);
    loadedCount = 0;
    tipoList.innerHTML = '';

    if (botaoMais) {
      botaoMais.disabled = false;
      botaoMais.textContent = 'Carregar Mais ⟳';
    }

    currentTipo = tipo;
    return true;
  } catch (err) {
    console.error('Erro ao inicializar tipo:', err);
    alert('Tipo de Pokémon não encontrado.');
    return false;
  }
}

// Inicialização principal
const tipoSelecionado = getTipoFromURL();
if (tipoSelecionado) {
  inicializarTipo(tipoSelecionado).then(sucesso => {
    if (sucesso) {
      carregarLote();
    }
  });
} else {
  alert('Nenhum tipo selecionado.');
}

// Evento do botão
if (botaoMais) {
  botaoMais.addEventListener('click', carregarLote);
}