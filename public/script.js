const API_CONFIG = {
  POKEAPI: 'https://pokeapi.co/api/v2/pokemon',
  ADVENTURE_TIME: 'https://api.sampleapis.com/adventuretime/characters'
};

let characters = [];
let editingId = null;
let currentApiCharacters = [];
let allOptions = {
  titles: [],
  bodies: [],
  abilities: [],
  species: []
};

document.addEventListener('DOMContentLoaded', function() {
  loadCharacters();
  setupEventListeners();
  updateStoryCharacterSelects();
  initializeFormOptions();
});

function setupEventListeners() {
  // Busca API
  document.getElementById('apiUniverseSearch').addEventListener('change', handleUniverseChange);
  document.getElementById('loadFromAPIButton').addEventListener('click', loadCharacterToForm);
  
  // Formulário
  document.getElementById('itemForm').addEventListener('submit', saveCharacter);
  
  // História
  document.getElementById('generateStoryButton').addEventListener('click', generateStory);

  // Fechar modal clicando fora
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('warningModal');
    if (event.target === modal) {
      closeModal();
    }
  });
}

function initializeFormOptions() {
  // Opções para Pokémon
  const pokemonOptions = {
    titles: ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle', 'Jigglypuff', 'Meowth', 'Psyduck', 'Gengar', 'Eevee', 'Snorlax'],
    bodies: [
      'Pokémon elétrico amarelo e fofo',
      'Pokémon do tipo planta e veneno',
      'Pokémon do tipo fogo com chama na cauda',
      'Pokémon do tipo água com casco',
      'Pokémon do tipo normal e fada com voz hipnótica',
      'Pokémon gato ganancioso que adora moedas',
      'Pokémon pato com dores de cabeça e poderes psíquicos',
      'Pokémon fantasma sombrio e misterioso',
      'Pokémon com capacidade de evoluir para várias formas',
      'Pokémon gigante e preguiçoso que adora dormir'
    ],
    abilities: [
      'Static, Lightning Rod',
      'Overgrow, Chlorophyll',
      'Blaze, Solar Power',
      'Torrent, Rain Dish',
      'Cute Charm, Competitive',
      'Pickup, Technician',
      'Damp, Cloud Nine',
      'Cursed Body, Levitate',
      'Adaptability, Run Away',
      'Immunity, Thick Fat'
    ],
    species: ['Pokémon']
  };

  // Opções para Hora de Aventura
  const adventureOptions = {
    titles: ['Finn', 'Jake', 'Princess Bubblegum', 'Marceline', 'Ice King', 'BMO', 'Lumpy Space Princess', 'Flame Princess', 'Lemongrab', 'Tree Trunks'],
    bodies: [
      'Herói aventureiro humano corajoso',
      'Cachorro mágico que estica e é o melhor amigo de Finn',
      'Princesa científica do Reino Doce feita de chiclete',
      'Rainha dos vampiros milenar e musicista',
      'Rei do gelo com coroa mágica e poderes congelantes',
      'Console de videogame vivo e inteligente',
      'Princesa do Lumpy Space com atitude dramática',
      'Princesa do Reino do Fogo com poderes flamejantes',
      'Conde temperamental obcecado por ordem e limão',
      'Elefante idosa que adora fazer tortas de maçã'
    ],
    abilities: [
      'Espada, Coragem, Liderança',
      'Esticar, Magia, Transformar',
      'Ciência, Liderança, Criação',
      'Voo, Música, Imortalidade',
      'Magia de Gelo, Voo, Criatura de Neve',
      'Jogos, Computação, Armazenamento',
      'Drama, Flutuação, Transformação',
      'Pirocinese, Liderança, Força',
      'Gritos, Ordem, Criar Subordinados',
      'Culinária, Sabedoria, Persistência'
    ],
    species: ['Humano', 'Cachorro Mágico', 'Chiclete', 'Vampira', 'Humano Mágico', 'Console Vivo', 'Ser Espacial', 'Ser de Fogo', 'Híbrido de Limão', 'Elefante']
  };

  // COMBINA todas as opções de ambos os universos
  allOptions = {
    titles: [...pokemonOptions.titles, ...adventureOptions.titles],
    bodies: [...pokemonOptions.bodies, ...adventureOptions.bodies],
    abilities: [...pokemonOptions.abilities, ...adventureOptions.abilities],
    species: [...pokemonOptions.species, ...adventureOptions.species]
  };
}

async function handleUniverseChange(event) {
  const universe = event.target.value;
  const characterSelect = document.getElementById('characterSelect');
  const statusDiv = document.getElementById('apiStatus');

  // Reset
  characterSelect.innerHTML = '<option value="">Primeiro selecione um universo</option>';
  characterSelect.disabled = true;
  statusDiv.style.display = 'none';

  if (!universe) return;

  characterSelect.disabled = true;
  characterSelect.classList.add('loading-select');

  statusDiv.style.display = 'block';
  statusDiv.className = 'api-status loading';
  statusDiv.textContent = 'Carregando personagens...';

  try {
    let characters = [];
    if (universe === 'pokemon') {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
      const data = await response.json();
      characters = data.results;
    } else if (universe === 'aventura') {
      try {
        const response = await fetch('https://api.sampleapis.com/adventuretime/characters');
        if (!response.ok) throw new Error('API não disponível');
        characters = await response.json();
      } catch (error) {
        characters = [
          { id: 1, name: 'Finn', species: 'Humano' },
          { id: 2, name: 'Jake', species: 'Cachorro Mágico' },
          { id: 3, name: 'Princess Bubblegum', species: 'Chiclete' },
          { id: 4, name: 'Marceline', species: 'Vampira' },
          { id: 5, name: 'Ice King', species: 'Humano' }
        ];
      }
    }

    currentApiCharacters = characters;
    populateCharacterSelect(characters, universe);

    statusDiv.className = 'api-status success';
    statusDiv.textContent = `Carregados ${characters.length} personagens.`;
  } catch (error) {
    statusDiv.className = 'api-status error';
    statusDiv.textContent = 'Erro ao carregar personagens.';
    console.error('Erro ao carregar personagens:', error);
  } finally {
    characterSelect.disabled = false;
    characterSelect.classList.remove('loading-select');
  }
}

function populateCharacterSelect(characters, universe) {
  const select = document.getElementById('characterSelect');
  select.innerHTML = '<option value="">Selecione um personagem</option>';

  characters.forEach((character, index) => {
    const option = document.createElement('option');
    if (universe === 'pokemon') {
      option.value = character.name;
      option.textContent = character.name.charAt(0).toUpperCase() + character.name.slice(1);
    } else {
      option.value = character.id || index;
      option.textContent = character.name;
    }
    option.setAttribute('data-universe', universe);
    select.appendChild(option);
  });
}

async function loadCharacterToForm() {
  const universe = document.getElementById('apiUniverseSearch').value;
  const characterSelect = document.getElementById('characterSelect');
  const characterId = characterSelect.value;
  const statusDiv = document.getElementById('apiStatus');

  if (!universe || !characterId) {
    showModal('Por favor, selecione um universo e um personagem.');
    return;
  }

  statusDiv.style.display = 'block';
  statusDiv.className = 'api-status loading';
  statusDiv.textContent = 'Carregando detalhes do personagem...';

  try {
    let characterData;
    if (universe === 'pokemon') {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${characterId}`);
      const data = await response.json();
      
      characterData = {
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        species: 'Pokémon',
        image: data.sprites.front_default,
        abilities: data.abilities.map(a => a.ability.name).join(', '),
        description: `Pokémon do tipo ${data.types.map(t => t.type.name).join(', ')}.`
      };
    } else if (universe === 'aventura') {
      const adventureCharacters = {
        '1': { name: 'Finn', species: 'Humano', image: '', abilities: 'Espada, Coragem', description: 'Herói aventureiro' },
        '2': { name: 'Jake', species: 'Cachorro Mágico', image: '', abilities: 'Esticar, Magia', description: 'Melhor amigo de Finn' },
        '3': { name: 'Princess Bubblegum', species: 'Chiclete', image: '', abilities: 'Ciência, Liderança', description: 'Princesa do Reino Doce' },
        '4': { name: 'Marceline', species: 'Vampira', image: '', abilities: 'Voo, Música', description: 'Rainha dos Vampiros' },
        '5': { name: 'Ice King', species: 'Humano', image: '', abilities: 'Magia de Gelo', description: 'Rei do Gelo' }
      };
      
      characterData = adventureCharacters[characterId] || {
        name: 'Personagem Desconhecido',
        species: 'Desconhecida',
        image: '',
        abilities: 'Desconhecidas',
        description: 'Personagem de Hora de Aventura'
      };
    }

    if (characterData) {
      // PRIMEIRO: Preenche todos os selects com TODAS as opções disponíveis
      updateAllFormSelects();
      
      // DEPOIS: Mapeia os dados do personagem para o formulário
      mapApiCharacterToForm(characterData, universe);
      
      statusDiv.className = 'api-status success';
      statusDiv.textContent = 'Personagem carregado no formulário! Agora você pode modificar as opções.';
      
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 4000);
    }
  } catch (error) {
    statusDiv.className = 'api-status error';
    statusDiv.textContent = 'Erro ao carregar detalhes do personagem.';
    console.error('Erro ao carregar detalhes:', error);
  }
}

function mapApiCharacterToForm(characterData, universe) {
    // Define o universo primeiro
    document.getElementById('universe').value = universe;
    
    // Define os valores nos selects (que já devem estar preenchidos com todas as opções)
    document.getElementById('species').value = characterData.species || '';
    document.getElementById('title').value = characterData.name || '';
    document.getElementById('imageUrl').value = characterData.image || '';
    document.getElementById('body').value = characterData.description || '';
    document.getElementById('abilities').value = characterData.abilities || '';

    lockApiFields(true);
}

function updateAllFormSelects(characterData = null) {
  // Atualiza todos os selects com TODAS as opções disponíveis (de todos os universos)
  // E pré-seleciona os valores atuais se characterData for fornecido
  updateSelectOptions('title', allOptions.titles, characterData ? characterData.name : '');
  updateSelectOptions('body', allOptions.bodies, characterData ? characterData.description : '');
  updateSelectOptions('abilities', allOptions.abilities, characterData ? characterData.abilities : '');
  updateSelectOptions('species', allOptions.species, characterData ? characterData.species : '');
}

function updateSelectOptions(selectId, options, currentValue = '') {
  const select = document.getElementById(selectId);
  const hasCurrentValue = options.includes(currentValue);
  
  select.innerHTML = '<option value="">Selecione...</option>';
  
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    
    // Seleciona a opção se for o valor atual
    if (option === currentValue) {
      optionElement.selected = true;
    }
    
    select.appendChild(optionElement);
  });
  
  // Se o valor atual não está nas opções, mas existe, adiciona como uma opção extra
  if (currentValue && !hasCurrentValue && currentValue !== '') {
    const optionElement = document.createElement('option');
    optionElement.value = currentValue;
    optionElement.textContent = `${currentValue} `;
    optionElement.selected = true;
    select.appendChild(optionElement);
  }
}

async function loadCharacterToForm() {
  const universe = document.getElementById('apiUniverseSearch').value;
  const characterSelect = document.getElementById('characterSelect');
  const characterId = characterSelect.value;
  const statusDiv = document.getElementById('apiStatus');

  if (!universe || !characterId) {
    showModal('Por favor, selecione um universo e um personagem.');
    return;
  }

  statusDiv.style.display = 'block';
  statusDiv.className = 'api-status loading';
  statusDiv.textContent = 'Carregando detalhes do personagem...';

  try {
    let characterData;
    if (universe === 'pokemon') {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${characterId}`);
      const data = await response.json();
      
      characterData = {
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        species: 'Pokémon',
        image: data.sprites.front_default,
        abilities: data.abilities.map(a => a.ability.name).join(', '),
        description: `Pokémon do tipo ${data.types.map(t => t.type.name).join(', ')}.`
      };
    } else if (universe === 'aventura') {
      const adventureCharacters = {
        '1': { name: 'Finn', species: 'Humano', image: '', abilities: 'Espada, Coragem', description: 'Herói aventureiro' },
        '2': { name: 'Jake', species: 'Cachorro Mágico', image: '', abilities: 'Esticar, Magia', description: 'Melhor amigo de Finn' },
        '3': { name: 'Princess Bubblegum', species: 'Chiclete', image: '', abilities: 'Ciência, Liderança', description: 'Princesa do Reino Doce' },
        '4': { name: 'Marceline', species: 'Vampira', image: '', abilities: 'Voo, Música', description: 'Rainha dos Vampiros' },
        '5': { name: 'Ice King', species: 'Humano', image: '', abilities: 'Magia de Gelo', description: 'Rei do Gelo' }
      };
      
      characterData = adventureCharacters[characterId] || {
        name: 'Personagem Desconhecido',
        species: 'Desconhecida',
        image: '',
        abilities: 'Desconhecidas',
        description: 'Personagem de Hora de Aventura'
      };
    }

    if (characterData) {
      // PRIMEIRO: Preenche todos os selects com TODAS as opções disponíveis E pré-seleciona os valores atuais
      updateAllFormSelects(characterData);
      
      // DEPOIS: Define o universo e outros campos
      document.getElementById('universe').value = universe;
      document.getElementById('imageUrl').value = characterData.image || '';
      
      lockApiFields(true);
      
      statusDiv.className = 'api-status success';
      statusDiv.textContent = 'Personagem carregado no formulário! Agora você pode modificar as opções.';
      
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 4000);
    }
  } catch (error) {
    statusDiv.className = 'api-status error';
    statusDiv.textContent = 'Erro ao carregar detalhes do personagem.';
    console.error('Erro ao carregar detalhes:', error);
  }
}

function updateSelectOptions(selectId, options, currentValue = '') {
  const select = document.getElementById(selectId);
  const hasCurrentValue = options.includes(currentValue);
  
  select.innerHTML = '<option value="">Selecione...</option>';
  
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    
    // Seleciona a opção se for o valor atual
    if (option === currentValue) {
      optionElement.selected = true;
    }
    
    select.appendChild(optionElement);
  });
  
  // Se o valor atual não está nas opções, mas existe, adiciona como uma opção extra
  if (currentValue && !hasCurrentValue && currentValue !== '') {
    const optionElement = document.createElement('option');
    optionElement.value = currentValue;
    optionElement.textContent = `${currentValue} `;
    optionElement.selected = true;
    select.appendChild(optionElement);
  }
}

async function loadCharacters() {
  try {
    const response = await fetch('/api/items');
    characters = await response.json();
    renderCharacters();
    updateStoryCharacterSelects();
  } catch (error) {
    console.error('Erro ao carregar personagens:', error);
    showModal('Erro ao carregar personagens.');
  }
}

async function saveCharacter(event) {
    event.preventDefault();
    
    const character = {
        title: document.getElementById('title').value.trim(),
        body: document.getElementById('body').value.trim(),
        universe: document.getElementById('universe').value,
        species: document.getElementById('species').value.trim(),
        imageUrl: document.getElementById('imageUrl').value.trim(),
        abilities: document.getElementById('abilities').value.trim()
    };

    if (!character.title || !character.universe) {
        showModal('É necessário carregar um personagem da API antes de salvar.');
        return;
    }

    try {
        let response;
        if (editingId) {
            response = await fetch(`/api/items/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(character)
            });
        } else {
            response = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(character)
            });
        }

        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }

        const savedCharacter = await response.json();
        console.log('Personagem salvo:', savedCharacter);
        
        resetForm();
        await loadCharacters();
        showModal(editingId ? 'Personagem atualizado com sucesso!' : 'Personagem criado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao salvar personagem:', error);
        showModal('Erro ao salvar personagem: ' + error.message);
    }
}

function editCharacter(id) {
    const character = characters.find(c => c.id === id);
    if (character) {
        // PRIMEIRO: Preenche todos os selects com TODAS as opções e pré-seleciona os valores atuais
        updateAllFormSelects({
            name: character.title,
            description: character.body,
            abilities: character.abilities,
            species: character.species
        });
        
        // DEPOIS: Preenche os outros campos
        document.getElementById('universe').value = character.universe || '';
        document.getElementById('imageUrl').value = character.imageUrl || '';
        editingId = id;
        
        lockApiFields(true);
        
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        
        showModal('Editando personagem existente. Agora você pode modificar todos os campos.');
    }
}

async function deleteCharacter(id) {
  if (!confirm('Tem certeza que deseja excluir este personagem?')) return;
  
  try {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    await loadCharacters();
    showModal('Personagem excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir personagem:', error);
    showModal('Erro ao excluir personagem.');
  }
}

function resetForm() {
    document.getElementById('itemForm').reset();
    editingId = null;
    
    // Limpa os selects
    const selectIds = ['title', 'body', 'abilities', 'species'];
    selectIds.forEach(id => {
        document.getElementById(id).innerHTML = '<option value="">Selecione...</option>';
    });
    
    lockApiFields(false);
}

function renderCharacters() {
    const tbody = document.querySelector('#itemsTable tbody');
    tbody.innerHTML = '';
    
    characters.forEach(character => {
        const tr = document.createElement('tr');
        
        let imageHtml = '';
        if (character.imageUrl && character.imageUrl.trim() !== '') {
            imageHtml = `<img src="${character.imageUrl}" class="table-image" alt="${character.title}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
        }
        
        const fallbackHtml = `<div class="table-image-fallback" style="${character.imageUrl ? 'display: none;' : ''}">?</div>`;
        
        tr.innerHTML = `
            <td>${character.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${imageHtml}
                    ${fallbackHtml}
                    <span>${character.title}</span>
                </div>
            </td>
            <td>${character.universe || '-'}</td>
            <td>${character.species || '-'}</td>
            <td>${character.body || '-'}</td>
            <td>${character.abilities || '-'}</td>
            <td>
                <button onclick="editCharacter(${character.id})">Editar</button>
                <button style="background:#d9534f;" onclick="deleteCharacter(${character.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStoryCharacterSelects() {
  const char1 = document.getElementById('char1');
  const char2 = document.getElementById('char2');
  
  char1.innerHTML = '<option value="">Selecione o primeiro personagem</option>';
  char2.innerHTML = '<option value="">Selecione o segundo personagem</option>';

  characters.forEach(character => {
    const option1 = document.createElement('option');
    option1.value = character.id;
    option1.textContent = `${character.title} (${character.universe || 'Sem universo'})`;
    char1.appendChild(option1.cloneNode(true));
    char2.appendChild(option1);
  });
}

async function generateStory() {
  const char1Id = document.getElementById('char1').value;
  const char2Id = document.getElementById('char2').value;

  if (!char1Id || !char2Id) {
    showModal('Por favor, selecione dois personagens para criar uma história.');
    return;
  }

  if (char1Id === char2Id) {
    showModal('Selecione personagens diferentes para criar uma história interessante!');
    return;
  }

  const char1 = characters.find(c => c.id == char1Id);
  const char2 = characters.find(c => c.id == char2Id);

  if (!char1 || !char2) {
    showModal('Erro: personagens não encontrados.');
    return;
  }

  const storyResult = document.getElementById('storyResult');
  const storyContent = document.getElementById('storyContent');
  const storyChars = document.getElementById('storyChars');

  storyResult.style.display = 'block';
  storyContent.innerHTML = '<p class="loading">Criando história mágica...</p>';
  storyChars.innerHTML = '';

  setTimeout(() => {
    const story = generateStoryWithAI(char1, char2);
    storyContent.innerHTML = `<div class="story-text">${story}</div>`;

    storyChars.innerHTML = `
  <div class="character-card">
    ${char1.imageUrl ? `<img src="${char1.imageUrl}" class="story-image" alt="${char1.title}">` : ''}
    <h4>${char1.title}</h4>
    <small>${char1.universe || 'Universo desconhecido'}</small>
    <div class="character-species">${char1.species || 'Espécie desconhecida'}</div>
  </div>
  <div class="character-card">
    ${char2.imageUrl ? `<img src="${char2.imageUrl}" class="story-image" alt="${char2.title}">` : ''}
    <h4>${char2.title}</h4>
    <small>${char2.universe || 'Universo desconhecido'}</small>
    <div class="character-species">${char2.species || 'Espécie desconhecida'}</div>
  </div>
`;

  }, 1500);
}

function generateStoryWithAI(char1, char2) {
  const stories = [
    `Em uma jornada épica, ${char1.title} e ${char2.title} se uniram para enfrentar um desafio incrível. ${char1.title} trouxe suas habilidades únicas enquanto ${char2.title} contribuiu com sua coragem inabalável. Juntos, eles provaram que a amizade pode superar qualquer obstáculo!`,
    `Quando dimensões colidiram, ${char1.title} foi transportado para o mundo de ${char2.title}. Inicialmente confusos, logo descobriram que suas diferenças os tornavam mais fortes. Uma amizade improvável nasceu, salvando ambos os universos da destruição.`,
    `Num dia comum, ${char1.title} e ${char2.title} se encontraram por acaso. O que começou como um simples encontro transformou-se na maior aventura de suas vidas, provando que os melhores parceiros são aqueles que menos esperamos.`,
    `Durante uma tempestade cósmica, os poderes de ${char1.title} e ${char2.title} se entrelaçaram criando uma conexão misteriosa. Agora, devem aprender a trabalhar juntos para controlar essa energia antes que ela consuma seus mundos.`,
    `Um antigo mistério exigia a sabedoria de ${char1.title} e a ousadia de ${char2.title}. Enquanto desvendavam enigmas ancestrais, descobriram que suas histórias estavam conectadas por um destino escrito nas estrelas.`,
    `Quando a paz foi ameaçada, ${char1.title} e ${char2.title} responderam ao chamado. Um com estratégia refinada, outro com instinto selvagem - juntos formaram a dupla perfeita para restaurar o equilíbrio universal.`,
    `Num torneio interdimencional, ${char1.title} e ${char2.title} foram forçados a formar uma equipe. Rivais no início, logo perceberam que suas habilidades complementares poderiam levá-los à vitória e a uma amizade surpreendente.`,
    `Uma profecia ancestral mencionava dois heróis de reinos distintos: ${char1.title} da terra do amanhecer e ${char2.title} do crepúsculo eterno. Unidos pelo destino, sua aliança se tornou a chave para desvendar segredos milenares.`
  ];
  
  return stories[Math.floor(Math.random() * stories.length)];
}

function showModal(message) {
  document.getElementById('modalMessage').textContent = message;
  document.getElementById('warningModal').style.display = 'flex';
  
  if (message.includes('sucesso')) {
    setTimeout(closeModal, 3000);
  }
}

function closeModal() {
  document.getElementById('warningModal').style.display = 'none';
}

function lockApiFields(lock) {
    const editableFields = ['universe', 'title', 'body', 'species', 'imageUrl', 'abilities']; 
    
    const indicators = document.querySelectorAll('.field-indicator');
    indicators.forEach(indicator => indicator.remove());

    if (lock) {
        editableFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.removeAttribute('readonly');
            field.removeAttribute('disabled');
            field.classList.remove('locked-field');
        });

        document.getElementById('submitButton').disabled = false;
        
    } else {
        editableFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.setAttribute('readonly', 'true');
            field.setAttribute('disabled', 'true');
            field.classList.add('locked-field');
        });
        
        document.getElementById('submitButton').disabled = true;
    }
}