//  -- Elementos HTML da Pagina Pokedex.html --  //
const cardsList = document.getElementById('Pokedex_CardsList');
const botaoMais = document.getElementById('Pokedex_ButtonMore');
const inputBar = document.getElementById('Pokedex_InputBar');
const searchButton = document.getElementById('Pokedex_ButtonSubmit');
const categorySelect = document.getElementById('Pokedex_InputCategorySelect');

//  -- Estados --  //
let offset = 0;
const limit = 20;
let modoPesquisa = false;
let tipoAtual = 'all'; // 'all' ou nome do tipo (ex: 'fire')

//  -- Funcao para redirecionar ao clicar no card --  //
async function searchRedirectPokemons(pokemonName) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!res.ok) throw new Error('Pokémon não encontrado');
        const data = await res.json();
        localStorage.setItem('Pokemon', JSON.stringify(data));
        window.location.href = './pokemon.html';
    } catch (err) {
        console.error('Erro ao carregar Pokémon:', err);
        alert('Não foi possível carregar os dados do Pokémon.');
    }
}

//  -- Funcao de Criar o Card do Pokemon --  //
function criarCard(pokemon, isFromSearch = false) {
    let id, nome, sprite, nameForApi;

    if (isFromSearch) {
        id = pokemon.id;
        nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        nameForApi = pokemon.name;
        sprite = `https://img.pokemondb.net/sprites/lets-go-pikachu-eevee/normal/${pokemon.name}.png`;
    } else {
        id = pokemon.url.split('/').filter(Boolean).pop();
        nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        nameForApi = pokemon.name;
        sprite = `https://img.pokemondb.net/sprites/lets-go-pikachu-eevee/normal/${pokemon.name}.png`;
    }

    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const isFavorito = favoritos.some(p => p.name === nameForApi);

    const li = document.createElement('li');
    li.classList.add("main_List__Card", "Pokedex_Card");
    li.innerHTML = `
        <div class="main_List__Card-Top">
            <p class="main_List__Card-Top--Index">#${String(id).padStart(3, '0')}</p>
            <button class="main_List__Card-Top--Icon ${isFavorito ? 'favoritado' : ''}" 
                    data-name="${nameForApi}" data-id="${id}">
                <img class="main_List__Card-Top--IconImage" 
                     src="./assets/icon_star.svg" 
                     alt="${isFavorito ? 'Favoritado' : 'Favoritar'}"/>
            </button>
        </div>
        <figure class="main_List__Image">
            <img class="main_List__Image-Img" src="${sprite}" alt="${nome}" onerror="this.src='./assets/pokeball.png'">
        </figure>
        <section class="main_List__Section">
            <p class="main_List__Section-Text">${nome}</p>
        </section>
    `;

    li.addEventListener('click', (e) => {
        if (e.target.closest('.main_List__Card-Top--Icon')) return;
        searchRedirectPokemons(nameForApi);
    });

    const starBtn = li.querySelector('.main_List__Card-Top--Icon');
    starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = starBtn.dataset.name;
        const currentId = starBtn.dataset.id;

        let lista = JSON.parse(localStorage.getItem('favoritos')) || [];
        const jaFavoritado = lista.some(p => p.name === name);

        if (!jaFavoritado) {
            lista.push({ name, id: currentId });
            starBtn.classList.add('favoritado');
            starBtn.querySelector('img').alt = 'Favoritado';
        } else {
            lista = lista.filter(p => p.name !== name);
            starBtn.classList.remove('favoritado');
            starBtn.querySelector('img').alt = 'Favoritar';
        }
        localStorage.setItem('favoritos', JSON.stringify(lista));
    });

    return li;
}

//  -- Limpar e redefinir estado --  //
function resetarEstado() {
    cardsList.innerHTML = '';
    offset = 0;
    modoPesquisa = false;
    botaoMais.style.display = 'flex';
    botaoMais.disabled = false;
    botaoMais.textContent = 'Carregar Mais ⟳';
}

//  -- Carregar lista completa (sem filtro) --  //
async function carregarListaCompleta() {
    if (modoPesquisa) return;
    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const dados = await resposta.json();
        dados.results.forEach(pokemon => {
            cardsList.appendChild(criarCard(pokemon, false));
        });
        offset += limit;
        if (!dados.next) {
            botaoMais.disabled = true;
            botaoMais.textContent = 'Fim';
        }
    } catch (erro) {
        console.error('Erro ao carregar Pokémons:', erro);
        alert('Não foi possível carregar a lista.');
    }
}

//  -- Carregar Pokémon por tipo --  //
async function carregarPorTipo(tipo) {
    if (modoPesquisa || tipo === 'all') return;
    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/type/${tipo}/`);
        const dados = await resposta.json();

        // A API de tipo traz todos de uma vez, então paginamos manualmente
        const pokemonsDoTipo = dados.pokemon.map(p => p.pokemon);
        const pagina = pokemonsDoTipo.slice(offset, offset + limit);

        pagina.forEach(pokemon => {
            cardsList.appendChild(criarCard(pokemon, false));
        });

        offset += limit;

        if (offset >= pokemonsDoTipo.length) {
            botaoMais.disabled = true;
            botaoMais.textContent = 'Fim';
        }
    } catch (erro) {
        console.error('Erro ao carregar por tipo:', erro);
        alert('Não foi possível carregar os Pokémon deste tipo.');
    }
}

//  -- Voltar à lista completa --  //
function voltarParaPokedexCompleta() {
    resetarEstado();
    tipoAtual = 'all';
    carregarListaCompleta();
}

//  -- Exibir resultado único da pesquisa --  //
async function exibirResultadoUnico(query) {
    if (!query.trim()) {
        voltarParaPokedexCompleta();
        return;
    }

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.trim().toLowerCase()}`);
        if (!res.ok) throw new Error('Pokémon não encontrado');

        const data = await res.json();

        resetarEstado();
        modoPesquisa = true;
        botaoMais.style.display = 'none';
        cardsList.appendChild(criarCard(data, true));
    } catch (err) {
        alert('Pokémon não encontrado.');
        voltarParaPokedexCompleta();
    }
}

//  -- Tratamento da pesquisa --  //
function tratamentoDePesquisa() {
    const busca = inputBar.value;
    exibirResultadoUnico(busca);
}

//  -- Carregar mais (com base no contexto atual) --  //
function carregarMais() {
    if (modoPesquisa) return;
    if (tipoAtual === 'all') {
        carregarListaCompleta();
    } else {
        carregarPorTipo(tipoAtual);
    }
}

//  -- Evento de mudança de categoria --  //
categorySelect.addEventListener('change', () => {
    const tipoSelecionado = categorySelect.value;
    tipoAtual = tipoSelecionado;

    resetarEstado();

    if (tipoSelecionado === 'all') {
        carregarListaCompleta();
    } else {
        carregarPorTipo(tipoSelecionado);
    }
});

//  -- Eventos de pesquisa --  //
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    tratamentoDePesquisa();
});

inputBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        tratamentoDePesquisa();
    }
});

//  -- Inicialização --  //
carregarListaCompleta();
botaoMais.addEventListener('click', carregarMais);