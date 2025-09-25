async function getEvolutions(  pokemonId  ) {
  var pokeEvolInfos;

  const pokeApi = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`

  await fetch(pokeApi)
    .then(  response => {

      if (!response.ok) {  return new Error("algo faio");  }

      return response.json();

    })
    .then(  data => {
      console.log(data);
      pokeEvolInfos = data;  
    });


  return pokeEvolInfos;
} 





async function getPokemon(  pokemon  ) {


  var pokeInfos;

  const pokeApi = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

  await fetch(pokeApi)
    .then(  response => {

      if (!response.ok) {  return new Error("algo faio");  }

      return response.json();

    })
    .then(  data => {  
      //console.log(data); 

      pokeInfos = {
        base_experience: data.base_experience,
        forms: data.forms,
        heigth: data.height,
        id: data.id,
        name: data.name,
        species: data.species,
        sprites: data.sprites,
        weight: data.weight
      }
    })

  console.log(  pokeInfos.id, getEvolutions(pokeInfos.id)   );
}







getPokemon(  "charmander"  );
