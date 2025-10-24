//  -- Variaveis para campo de Search --  // 
const inputBar = document.getElementById('Home_SearchInput');
const searchButton = document.getElementById('searchButton');





//  -- Redirect para Pokemon.html --  //
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
