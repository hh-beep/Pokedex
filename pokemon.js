// Função principal: carrega os dados do Pokémon que foi salvo na página anterior
async function carregarPokemon() {
  // Pego os dados que foram salvos no localStorage (quando o usuário clicou no card)
  const dadosSalvos = localStorage.getItem('pokemon_selecionado');
  
  // Se não tiver nenhum dado salvo, mostro uma mensagem amigável
  if (!dadosSalvos) {
    document.body.innerHTML = '<h1 style="text-align:center; margin-top:50px;">Nenhum Pokémon selecionado!</h1>';
    return;
  }

  // Transformo os dados de volta em um objeto JavaScript
  const data = JSON.parse(dadosSalvos);

  // Atualizo o número do Pokémon (ex: #025) com zeros à esquerda
  document.getElementById('Pokemon_InfosId').textContent = `#${String(data.id).padStart(3, '0')}`;

  // Atualizo o nome com a primeira letra maiúscula (ex: "pikachu" → "Pikachu")
  document.getElementById('Pokemon_InfosName').textContent = 
    data.name.charAt(0).toUpperCase() + data.name.slice(1);

  // Mostro a imagem do Pokémon:
  // Primeiro tento usar a arte oficial (mais bonita), se não tiver, uso o sprite padrão
  const img = document.getElementById('Pokemon_InfosImageURL');
  img.src = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default;
  img.alt = data.name; // Texto alternativo para acessibilidade

  // Limpo a lista de tipos e adiciono os tipos do Pokémon (ex: "Electric", "Flying")
  const typesList = document.getElementById('Pokemon_InfosTypes');
  typesList.innerHTML = ''; // Limpa qualquer conteúdo antigo
  data.types.forEach(tipoInfo => {
    const li = document.createElement('li');
    // Formato o nome do tipo com letra maiúscula
    li.textContent = tipoInfo.type.name.charAt(0).toUpperCase() + tipoInfo.type.name.slice(1);
    typesList.appendChild(li);
  });

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

// Quando a página terminar de carregar, executa a função acima
carregarPokemon();

// Quando o usuário sair ou recarregar a página, limpo os dados salvos
// Isso evita que ele volte e veja o mesmo Pokémon por acidente
window.addEventListener('beforeunload', () =>{})