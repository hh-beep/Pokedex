const typeStyle = (type) => {
  if (type == "grass" || type == "bug")                              {  return "Green"  }
  else if (type == "poison" || type == "ghost" || type == "")        {  return "Purple"  }
  else if (type == "fighting" || type == "ground" || type == "rock") {  return "Red"  }
  else if (type == "fire" || type == "dragon")                       {  return "Orange"  }
  else if (type == "water" || type == "ice")                         {  return "Blue"  }
  else if (type == "electric")                                        {  return "Yellow"  }
  else if (type == "psychic" || type == "fairy")                     {  return "Pink"  }
  else if (type == "flying" || type == "steel")                      {  return "WhiteSmoke"  }
  else if (type == "dark" || type == "stellar")                      {  return "Black"  }
  else                                                               {  return "White"  }
}



//  -- Carrega os dados do Pokémon pelo localStorage:[Pokemon] --  //
async function carregarPokemon() {



  // Pego os dados que foram salvos no localStorage (quando o usuário clicou no card)
  const dadosSalvos = localStorage.getItem('Pokemon');
  

  // Se não tiver nenhum dado salvo, mostro uma mensagem amigável
  if (!dadosSalvos) {
    document.body.innerHTML = '<h1 style="text-align:center; margin-top:50px;">Nenhum Pokémon selecionado!</h1>';
    return;
  }


  // Transformo os dados de volta em um objeto JavaScript
  const data = JSON.parse(dadosSalvos);





  //  Id do Pokemon
  document.getElementById('Pokemon_InfosId').textContent = `#${String(data.id).padStart(3, '0')}`;


  // Nome do Pokemone
  document.getElementById('Pokemon_InfosName').textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);


  //  Sprite Pixelado do Poke
  const img = document.getElementById('Pokemon_InfosImageURL');
  img.src = `https://img.pokemondb.net/sprites/lets-go-pikachu-eevee/normal/${data.name}.png`;
  img.alt = data.name; // Texto alternativo para acessibilidade




  // Limpo a lista de tipos e adiciono os tipos do Pokémon (ex: "Electric", "Flying")
  var listStyles = [];
  const typesList = document.getElementById('Pokemon_InfosTypes');
  typesList.innerHTML = ''; // Limpa qualquer conteúdo antigo
  data.types.forEach(tipoInfo => {
    const li = document.createElement('li');
    // Formato o nome do tipo com letra maiúscula
    console.log(tipoInfo.type.name);
    li.textContent = tipoInfo.type.name.charAt(0).toUpperCase() + tipoInfo.type.name.slice(1);
    typesList.appendChild(li);
    


    li.classList.add(`${typeStyle(  tipoInfo.type.name  )}`);
    li.classList.add("ListaCard");

    listStyles.push(  typeStyle(  tipoInfo.type.name  )  )
  });



  //  -- Mudar a cor do Bakckground --  //
  const body = document.querySelector("body");
  body.classList.add(`${listStyles[0]}`);





  // Organizo os status (HP, Ataque, Defesa, Velocidade) em um objeto fácil de usar
  const stats = {};
  data.stats.forEach(stat => {
    stats[stat.stat.name] = stat.base_stat;
  });



  // Atualizo cada campo de status na tela
  document.getElementById('Pokemon_InfosHP').textContent = `HP: ${stats.hp || 0}`;
  document.getElementById('Pokemon_InfosAttack').textContent = `Attack: ${stats.attack || 0}`;
  document.getElementById('Pokemon_InfosDefense').textContent = `Defense: ${stats.defense || 0}`;
  document.getElementById('Pokemon_InfosSpeed').textContent = `Speed: ${stats.speed || 0}`;
}



/*  Ent d[a] pra add um botao de loading dps e dai quando carregar sobrescrever as infos */
// Quando a página terminar de carregar, executa a função acima
carregarPokemon();



/*  Aqui e so limpa o localStorage... */
window.addEventListener('beforeunload', () =>{  localStorage.clear()  })