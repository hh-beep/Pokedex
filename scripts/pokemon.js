const typeStyle = (type) => {
  if (type == "grass" || type == "bug") return "Green";
  else if (type == "poison" || type == "ghost" || type == "") return "Purple";
  else if (type == "fighting" || type == "ground" || type == "rock") return "Red";
  else if (type == "fire" || type == "dragon") return "Orange";
  else if (type == "water" || type == "ice") return "Blue";
  else if (type == "electric") return "Yellow";
  else if (type == "psychic" || type == "fairy") return "Pink";
  else if (type == "flying" || type == "steel") return "WhiteSmoke";
  else if (type == "dark" || type == "stellar") return "Black";
  else return "White";
};

// -- Função principal: Carrega os dados do Pokémon e configura a estrela --
async function carregarPokemon() {
  const dadosSalvos = localStorage.getItem('Pokemon');
  if (!dadosSalvos) {
    document.body.innerHTML = '<h1 style="text-align:center; margin-top:50px;">Nenhum Pokémon selecionado!</h1>';
    return;
  }

  const data = JSON.parse(dadosSalvos);
  const pokemonName = data.name;
  const pokemonId = data.id;

  // --- Atualiza informações principais (mantido do seu código) ---
  document.getElementById('Pokemon_InfosId').textContent = `#${String(pokemonId).padStart(3, '0')}`;
  document.getElementById('Pokemon_InfosName').textContent = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

  const img = document.getElementById('Pokemon_InfosImageURL');
  img.src = `https://img.pokemondb.net/sprites/black-white/normal/${pokemonName}.png`;
  img.alt = pokemonName;

  const typesList = document.getElementById('Pokemon_InfosTypes');
  typesList.innerHTML = '';
  const listStyles = [];
  data.types.forEach(tipoInfo => {
    const li = document.createElement('li');
    const typeName = tipoInfo.type.name;
    li.textContent = typeName.charAt(0).toUpperCase() + typeName.slice(1);
    li.classList.add(typeStyle(typeName), "ListaCard");
    typesList.appendChild(li);
    listStyles.push(typeStyle(typeName));
  });

  document.querySelector("body").classList.add(listStyles[0]);

  const stats = {};
  data.stats.forEach(stat => {
    stats[stat.stat.name] = stat.base_stat;
  });

  document.getElementById('Pokemon_InfosHP').textContent = `HP: ${stats.hp || 0}`;
  document.getElementById('Pokemon_InfosAttack').textContent = `Attack: ${stats.attack || 0}`;
  document.getElementById('Pokemon_InfosDefense').textContent = `Defense: ${stats.defense || 0}`;
  document.getElementById('Pokemon_InfosSpeed').textContent = `Speed: ${stats.speed || 0}`;

  // --- Configuração da estrela de favoritos ---
  const favoritoBtn = document.getElementById('Pokemon_FavoritoBtn');
  if (!favoritoBtn) {
    console.warn('Botão de favorito não encontrado. Verifique o HTML.');
    return;
  }

  // Verifica se já está nos favoritos
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const isFavorito = favoritos.some(p => p.name === pokemonName);

  // Atualiza visual da estrela
  if (isFavorito) {
    favoritoBtn.classList.add('favoritado');
    favoritoBtn.querySelector('img').alt = 'Favoritado';
  } else {
    favoritoBtn.classList.remove('favoritado');
    favoritoBtn.querySelector('img').alt = 'Favoritar';
  }

  // Clique na estrela: alternar favorito
  favoritoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let lista = JSON.parse(localStorage.getItem('favoritos')) || [];
    const index = lista.findIndex(p => p.name === pokemonName);

    if (index === -1) {
      // Adiciona
      lista.push({ name: pokemonName, id: pokemonId });
    } else {
      // Remove
      lista.splice(index, 1);
    }

    localStorage.setItem('favoritos', JSON.stringify(lista));

    // Atualiza visual imediatamente
    if (index === -1) {
      favoritoBtn.classList.add('favoritado');
      favoritoBtn.querySelector('img').alt = 'Favoritado';
    } else {
      favoritoBtn.classList.remove('favoritado');
      favoritoBtn.querySelector('img').alt = 'Favoritar';
    }
  });
}

// Executa ao carregar a página
carregarPokemon();

// ⚠️ IMPORTANTE: galerinha não limpa TODO o localStorage aqui!
// Isso apagaria os favoritos! Mantenha apenas se quiserem limpar o Pokémon atual. Deixarei comentado apenas para termos o codigo
// window.addEventListener('beforeunload', () => {
//   localStorage.removeItem('Pokemon'); // apenas o Pokémon atual
// });
