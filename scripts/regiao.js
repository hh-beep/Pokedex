// Função para obter a região da URL
function getRegiaoFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('regiao')?.toLowerCase();
}

// Mapeamento de regiões
const regioesMap = {
  kanto: { start: 1, end: 151, nome: 'Kanto' },
  johto: { start: 152, end: 251, nome: 'Johto' },
  hoenn: { start: 252, end: 386, nome: 'Hoenn' },
  sinnoh: { start: 387, end: 493, nome: 'Sinnoh' },
  unova: { start: 494, end: 649, nome: 'Unova' },
  kalos: { start: 650, end: 721, nome: 'Kalos' },
  alola: { start: 722, end: 809, nome: 'Alola' },
  galar: { start: 810, end: 898, nome: 'Galar' },
  paldea: { start: 906, end: 1025, nome: 'Paldea' }
};

// Elementos (assumem que existem no HTML)
const regiaoList = document.getElementById('Regiao_List');
const titleElement = document.querySelector('.main_Section__Tittle');
const botaoMais = document.getElementById('Regiao_ButtonMore');
const loadingEl = document.getElementById('Regiao_Loading');
const errorEl = document.getElementById('Regiao_Error');

// Estado
let allIds = [];
let loadedCount = 0;
const limit = 20;

// ✅ Função de card com favoritos (mesmo comportamento da pokedex.html)
function criarCard(pokemon) {
  const id = pokemon.id;
  const nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // Verifica se já está nos favoritos
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const isFavorito = favoritos.some(p => p.name === pokemon.name);

  const li = document.createElement('li');
  li.classList.add('main_List__Card', 'Pokedex_Card');

  const letsGoUrl = `https://img.pokemondb.net/sprites/black-white/normal/${pokemon.name}.png`;
  const officialArt = pokemon.sprites?.other?.['official-artwork']?.front_default;
  const defaultSprite = pokemon.sprites?.front_default;
  const fallback = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

  li.innerHTML = `
    <div class="main_List__Card-Top">
      <p class="main_List__Card-Top--Index">#${String(id).padStart(3, '0')}</p>
      <button class="main_List__Card-Top--Icon ${isFavorito ? 'favoritado' : ''}" 
              data-name="${pokemon.name}" data-id="${id}" aria-label="${isFavorito ? 'Favoritado' : 'Favoritar'}">
        <img class="main_List__Card-Top--IconImage" src="./assets/icon_star.svg" alt="${isFavorito ? 'Favoritado' : 'Favoritar'}"/>
      </button>
    </div>
    <figure class="main_List__Image">
      <img class="main_List__Image-Img" src="${letsGoUrl}" alt="${nome}" data-fallback="${officialArt || defaultSprite || fallback}" />
    </figure>
    <section class="main_List__Section">
      <p class="main_List__Section-Text">${nome}</p>
    </section>
  `;

  // Tratamento de erro de imagem
  const img = li.querySelector('.main_List__Image-Img');
  img.addEventListener('error', function() {
    this.src = this.getAttribute('data-fallback');
    this.removeEventListener('error', arguments.callee);
  });

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

// Atualiza estado visual usando classes (CSS deve controlar display)
function showLoading() {
  if (loadingEl) loadingEl.classList.add('visible');
  if (errorEl) errorEl.classList.remove('visible');
}

function showError(message) {
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
  if (loadingEl) loadingEl.classList.remove('visible');
}

function hideLoading() {
  if (loadingEl) loadingEl.classList.remove('visible');
}

// Carrega lote
async function carregarLote() {
  if (loadedCount >= allIds.length) {
    if (botaoMais) {
      botaoMais.disabled = true;
      botaoMais.textContent = 'Fim';
    }
    return;
  }

  showLoading();

  const loteIds = allIds.slice(loadedCount, loadedCount + limit);
  const pokemons = [];

  try {
    for (const id of loteIds) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      if (res.ok) {
        const data = await res.json();
        pokemons.push(data);
      }
    }

    pokemons.forEach(pkm => {
      regiaoList.appendChild(criarCard(pkm));
    });

    loadedCount += pokemons.length;

    if (loadedCount >= allIds.length && botaoMais) {
      botaoMais.disabled = true;
      botaoMais.textContent = 'Fim';
    }

  } catch (err) {
    console.error('Erro:', err);
    showError('Erro ao carregar os dados. Verifique sua conexão.');
  } finally {
    hideLoading();
  }
}

// Inicializa região
function inicializarRegiao(regiaoKey) {
  const regiao = regioesMap[regiaoKey];
  if (!regiao) {
    showError('Região não reconhecida.');
    return false;
  }

  if (titleElement) {
    titleElement.textContent = `Pokémons de: ${regiao.nome}`;
  }

  allIds = [];
  for (let i = regiao.start; i <= regiao.end; i++) {
    allIds.push(i);
  }

  loadedCount = 0;
  if (regiaoList) regiaoList.innerHTML = '';

  if (botaoMais) {
    botaoMais.disabled = false;
    botaoMais.textContent = 'Carregar Mais ⟳';
  }

  return true;
}

// Inicialização
const regiaoSelecionada = getRegiaoFromURL();

if (regiaoSelecionada) {
  if (inicializarRegiao(regiaoSelecionada)) {
    carregarLote();
  }
} else {
  showError('Nenhuma região selecionada.');
}

// Evento do botão
if (botaoMais) {
  botaoMais.addEventListener('click', carregarLote);
}