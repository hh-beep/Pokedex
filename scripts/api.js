// função principal
async function buscarPokemon(nomeOuId) {
    try{
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon/${nomeOuId.toLowerCase()}") //chamnado API

        if(!resposta.ok){ 
            throw new Error("Pokémon não encontrado!") //retorna catch
        }

        const dados = await resposta.json() // json função assicrona, await pra esperar pegar todos os dados

        const pokemon = {
            id: dados.id,
            nome: dados.name.charAt(0).toUpperCase() + dados.name.slice(1), // usado para formatar o nome, coloca a primeira letra em maisculo e o resto em minusculo (Se escrito em capslock)
            tipo: dados.types.map(t => t.type.name), //pega o tipo do pokemon
            altura: dados. height / 10, // /10 convertendo para metros 
            peso: dados.weight / 10, // /10 convertendo para kg
            imagem: dados.sprites.front_default
        };

        console.log("Pokemon encontrado: ",pokemon)
        return pokemon;

    } catch(erro){
    console.error("Erro: ", erro.message)
    return null;
    }
}
    //função favoritosR
function pegarFavoritos() {
  const favoritosJSON = localStorage.getItem("favoritos");
  return favoritosJSON ? JSON.parse(favoritosJSON) : [];
}

function salvarFavoritos(favoritos) {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function adicionarFavorito(pokemon) {
  const favoritos = pegarFavoritos();
  if (!favoritos.includes(pokemon.id)) {
    favoritos.push(pokemon.id);
    salvarFavoritos(favoritos);
    console.log("${pokemon.nome} adicionado aos favoritos!");
  } else {
    console.log("${pokemon.nome} já está nos favoritos.");
  }
}

function removerFavorito(pokemonId) {
  let favoritos = pegarFavoritos();
  favoritos = favoritos.filter(id => id !== pokemonId);
  salvarFavoritos(favoritos);
  console.log("Pokémon com ID ${pokemonId} removido dos favoritos.");
}

function estaFavorito(pokemonId) {
  const favoritos = pegarFavoritos();
  return favoritos.includes(pokemonId);
}
