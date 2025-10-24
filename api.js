// Pego os elementos do HTML que vou usar
const cardsList = document.getElementById('Pokedex_CardsList');
const botaoMais = document.getElementById('botaoMais');
const inputBar = document.getElementById('Pokedex_InputBar');
const searchButton = document.getElementById('Pokedex_ButtonSubmit');

// Configuração da paginação: quantos Pokémon mostrar por vez e de onde começar
let offset = 0;
const limit = 20;

// Função que cria um card (um bloco visual) para cada Pokémon
function criarCard(pokemon) {
  // Pego o ID do Pokémon a partir da URL (ex: "https://pokeapi.co/api/v2/pokemon/25/" → ID = 25)
  const id = pokemon.url.split('/').filter(Boolean).pop();
  
  // Deixo o nome com a primeira letra maiúscula (ex: "pikachu" vira "Pikachu")
  const nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  // Monto o link da imagem do Pokémon (sprite da versão padrão)
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  // Crio o elemento HTML do card
  const li = document.createElement('li');
  li.innerHTML = 
    `<div class="main_List__Card Pokedex_Card" data-name="${pokemon.name}">
      <div class="main_List__Card-Top">
        <p class="main_List__Card-Top--Index">#${String(id).padStart(3, '0')}</p>
        <button class="main_List__Card-Top--Icon">
          <img class="main_List__Card-Top--IconImage" src="./assets/icon_star.svg" alt="Favoritar"/>
        </button>
      </div>
      <figure class="main_List__Image">
        <img src="${sprite}" alt="${nome}">
      </figure>
      <section class="main_List__Section">
        <p class="main_List__Section-Text">${nome}</p>
      </section>
    </div>`;

  // Quando clico no card, carrego os dados completos do Pokémon e vou para a página dele
  const card = li.querySelector('.Pokedex_Card');
  card.addEventListener('click', async () => {
    try {
      // Busco os dados detalhados do Pokémon na API
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      if (!res.ok) throw new Error('Pokémon não encontrado');
      
      const data = await res.json();
      // Salvo os dados no localStorage para usar na próxima página
      localStorage.setItem('pokemon_selecionado', JSON.stringify(data));
      // Vou para a página de detalhes
      window.location.href = './pokemon.html';
    } catch (err) {
      console.error('Erro ao carregar Pokémon:', err);
      alert('Não foi possível carregar os dados do Pokémon.');
    }
  });

  return li;
}

// Função que busca uma lista de Pokémon da API (com paginação)
async function carregarLista() {
  try {
    // Peço à API um pedaço da lista (ex: do 0 ao 20, depois do 20 ao 40...)
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const dados = await resposta.json();

    // Para cada Pokémon recebido, crio um card e coloco na lista
    dados.results.forEach(pokemon => {
      cardsList.appendChild(criarCard(pokemon));
    });

    // Avanço o offset para a próxima página
    offset += limit;

    // Se não houver mais Pokémon, desativo o botão "carregar mais"
    if (!dados.next) {
      botaoMais.disabled = true;
      botaoMais.textContent = 'Fim';
    }
  } catch (erro) {
    console.error('Erro ao carregar Pokémons:', erro);
    alert('Não foi possível carregar a lista de Pokémon.');
  }
}

// Função que busca um único Pokémon pelo nome ou ID digitado
async function buscarPokemon(query) {
  if (!query) return;
  const cleanQuery = query.toLowerCase().trim(); // Deixo tudo minúsculo e tiro espaços

  try {
    // Peço os dados do Pokémon específico
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanQuery}`);
    if (!res.ok) {
      alert('Pokémon não encontrado!');
      return;
    }
    const data = await res.json();
    localStorage.setItem('pokemon_selecionado', JSON.stringify(data));
    window.location.href = './pokemon.html';
  } catch (err) {
    console.error('Erro ao buscar Pokémon:', err);
    alert('Erro ao carregar os dados do Pokémon.');
  }
}

// Ao carregar a página, mostro os primeiros 20 Pokémon (se os elementos existirem)
if (cardsList && botaoMais) {
  carregarLista();
}

// Quando clico no botão "carregar mais", carrego a próxima página
if (botaoMais) {
  botaoMais.addEventListener('click', carregarLista);
}

// Função que trata a pesquisa (quando clica no botão ou aperta Enter)
function lidarComPesquisa(e) {
  e.preventDefault(); // Impede o formulário de recarregar a página
  const busca = inputBar.value.trim();
  if (busca) {
    buscarPokemon(busca);
  } else {
    alert('Digite o nome ou ID de um Pokémon!');
  }
}

// Conecto o botão de busca e o campo de texto à função de pesquisa
if (searchButton) {
  searchButton.addEventListener('click', lidarComPesquisa);
}
if (inputBar) {
  inputBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') lidarComPesquisa(e);
  });
}

// Também trato a barra de busca da página inicial (home), se existir
const homeInput = document.getElementById('Home_SearchInput');
const homeSearchBtn = document.getElementById('searchButton');

function lidarComPesquisaHome(e) {
  e?.preventDefault?.(); // Segurança para evitar erro se "e" for undefined
  const query = homeInput?.value.trim();
  if (query) {
    buscarPokemon(query);
  } else {
    alert('Digite o nome ou ID de um Pokémon!');
  }
}

if (homeSearchBtn) {
  homeSearchBtn.addEventListener('click', lidarComPesquisaHome);
}
if (homeInput) {
  homeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') lidarComPesquisaHome(e);
  });
}