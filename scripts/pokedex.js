//  -- Elementos HTML da Pagina Pokedex.html --  //
const cardsList = document.getElementById('Pokedex_CardsList');
const botaoMais = document.getElementById('Pokedex_ButtonMore');
const inputBar = document.getElementById('Pokedex_InputBar');
const searchButton = document.getElementById('Pokedex_ButtonSubmit');



//  -- Definicoes para um Carregamento especifico da API --  //
let offset = 0;
const limit = 20;





//  -- Funcao de Search e redirect para Pokemon.html (ficou repetido em partes do codigo) --  //
async function searchRedirectPokemons(  pokemonName  ) {
    try {
        // Busco os dados detalhados do Pokémon na API
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${  pokemonName  }`);
        if (!res.ok) throw new Error('Pokémon não encontrado');
      

        //  Salvamento das Infos do Pokemon selecionado pelo LocalStorage []
        const data = await res.json();
        localStorage.setItem('Pokemon', JSON.stringify(data));
        //  Redirect pra pagina Pokemon.html
        window.location.href = './pokemon.html';
    } 
    catch (err) {
        console.error('Erro ao carregar Pokémon:', err);
        alert('Não foi possível carregar os dados do Pokémon.');
    }
}





//  -- Funcao de Criar o Card do Pokemon --  //
function criarCard(pokemon) {



  //  ID do Pokémon a partir da URL (ex: "https://pokeapi.co/api/v2/pokemon/25/" → ID = 25)
  const id = pokemon.url.split('/').filter(Boolean).pop();
  
  //  Nome com a primeira letra maiúscula [Capitalized] (ex: "pikachu" vira "Pikachu")
  const nome = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  //  URL do Sprite da imagem do Pokémon (sprite da versão padrão) [1 url e a antiga]
  //  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const sprite = `https://img.pokemondb.net/sprites/lets-go-pikachu-eevee/normal/${pokemon.name}.png`;



  //  Cardd do  Pokemon
  const li = document.createElement('li');
  li.classList.add("main_List__Card");
  li.classList.add("Pokedex_Card")
  li.innerHTML = `
      <div class="main_List__Card-Top">
        <p class="main_List__Card-Top--Index">#${String(id).padStart(3, '0')}</p>
        <button class="main_List__Card-Top--Icon">
          <img class="main_List__Card-Top--IconImage" src="./assets/icon_star.svg" alt="Favoritar"/>
        </button>
      </div>
      <figure class="main_List__Image">
        <img class="main_List__Image-Img" src="${sprite}" alt="${nome}">
      </figure>
      <section class="main_List__Section">
        <p class="main_List__Section-Text">${nome}</p>
      </section>
    `;

  
  li.addEventListener('click', async () => {
    searchRedirectPokemons(  pokemon.name  )
  });

  return li;
}





//  -- Loading das Listas [de 20 em 20 Pokemons] --  //
async function carregarLista() {
  try {


    //  Request de um pedaço da API (ex: do 0 ao 20, depois do 20 ao 40...)
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const dados = await resposta.json();


    //  Para cada Pokémon recebido, crio um card e coloco na lista
    dados.results.forEach(pokemon => {  cardsList.appendChild(  criarCard(pokemon)  )  });


    //  Avanço o offset para a próxima página [tipo, do 0-20 pokemon agora vai do 20-40]
    offset += limit;
 

    //  Se não houver mais Pokémon, desativo o botão "carregar mais"
    if (!dados.next) {
      botaoMais.disabled = true;
      botaoMais.textContent = 'Fim';
    }
  } 
  catch (erro) {
    console.error('Erro ao carregar Pokémons:', erro);
    alert('Não foi possível carregar a lista de Pokémon.');
  }
}





//  -- Loading das Listas Inicial + Funcao do Botao de Loading das Listas --  //
carregarLista();
botaoMais.addEventListener(  'click', carregarLista  );





function tratamentoDePesquisa() {
  const busca = inputBar.value.trim();

  if (busca) {
    const cleanQuery = busca.toLowerCase().trim(); // Deixo tudo minúsculo e tiro espaços
    searchRedirectPokemons(  cleanQuery  );
  } 


  else {
    alert('Digite o nome ou ID de um Pokémon!');
  }
}



// Função que trata a pesquisa (quando clica no botão ou aperta Enter)
searchButton.addEventListener('click', e => {
  e.preventDefault();
  tratamentoDePesquisa();
})



inputBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        tratamentoDePesquisa();
    };
});