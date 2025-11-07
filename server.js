// ==========================================
// IMPORTAÇÃO DE MÓDULOS E DEPENDÊNCIAS
// ==========================================

// Importa o framework Express para criar o servidor web
const express = require('express');

// Importa o middleware CORS para habilitar Cross-Origin Resource Sharing
// Isso permite que o servidor aceite requisições de diferentes domínios
const cors = require('cors');

// Importa o middleware Body Parser para processar dados do corpo das requisições HTTP
// Especificamente para interpretar dados no formato JSON
const bodyParser = require('body-parser');

// Importa o módulo Path do Node.js para trabalhar com caminhos de arquivos e diretórios
// Fornece utilitários para trabalhar com estruturas de arquivos e caminhos
const path = require('path');

// ==========================================
// CONFIGURAÇÃO INICIAL DO APLICATIVO EXPRESS
// ==========================================

// Cria uma instância do aplicativo Express
// Esta instância será o núcleo do nosso servidor
const app = express();

// Habilita o middleware CORS para todas as rotas
// Isso permite que frontends em domínios diferentes acessem esta API
app.use(cors());

// Configura o Body Parser para interpretar automaticamente JSON no corpo das requisições
// Quando recebe dados com Content-Type: application/json, converte para objeto JavaScript
app.use(bodyParser.json());

// Serve arquivos estáticos (HTML, CSS, JavaScript, imagens) do diretório 'public'
// Qualquer arquivo na pasta 'public' fica acessível diretamente pela URL
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// "BANCO DE DADOS" EM MEMÓRIA (SIMULAÇÃO)
// ==========================================

// Array que simula um banco de dados em memória
// Os dados serão perdidos quando o servidor for reiniciado
let items = [
  { 
    id: 1,                                   // Identificador único do item
    title: 'Pikachu',                        // Nome/título do personagem
    body: 'Pokémon elétrico',                // Descrição breve
    universe: 'pokemon',                     // Universo de origem (categoria)
    species: 'Pokémon',                      // Espécie/raça do personagem
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', // URL da imagem
    abilities: 'Choque do Trovão, Velocidade' // Habilidades especiais
  },
  { 
    id: 2, 
    title: 'Finn', 
    body: 'Herói aventureiro', 
    universe: 'aventura',
    species: 'Humano',
    imageUrl: '',                            // String vazia = sem imagem
    abilities: 'Espada, Coragem'
  }
];

// Variável para controlar o próximo ID a ser atribuído
// Começa em 3 porque já temos 2 itens iniciais (IDs 1 e 2)
let nextId = 3;

// ==========================================
// DEFINICÃO DAS ROTAS DA API (CRUD)
// ==========================================

// Rota: GET /api/items
// Propósito: Recuperar todos os itens do "banco de dados"
// Método HTTP: GET
// Parâmetros: Nenhum
app.get('/api/items', (req, res) => {
  // Retorna toda a lista de itens convertida para JSON
  // O Express automaticamente define o Content-Type como application/json
  res.json(items);
});

// Rota: GET /api/items/:id
// Propósito: Recuperar um item específico pelo seu ID
// Método HTTP: GET
// Parâmetros: id (na URL)
app.get('/api/items/:id', (req, res) => {
  // Converte o parâmetro :id da URL de string para número inteiro
  // O segundo argumento '10' especifica que é base decimal
  const id = parseInt(req.params.id, 10);
  
  // Busca o item no array que tenha o ID correspondente
  // O método find() retorna o primeiro elemento que satisfaz a condição
  const item = items.find(i => i.id === id);
  
  // Se nenhum item for encontrado (item é undefined), retorna erro 404
  if (!item) return res.status(404).json({ error: 'Not found' });
  
  // Retorna o item encontrado em formato JSON
  res.json(item);
});

// Rota: POST /api/items
// Propósito: Criar um novo item no "banco de dados"
// Método HTTP: POST
// Parâmetros: Dados no corpo da requisição (JSON)
app.post('/api/items', (req, res) => {
  // Extrai as propriedades do corpo da requisição usando destructuring
  // req.body contém os dados JSON enviados pelo cliente
  const { title, body, universe, species, imageUrl, abilities } = req.body;
  
  // Validação: verifica se o título foi fornecido
  // Se não foi, retorna erro 400 (Bad Request)
  if (!title) return res.status(400).json({ error: 'title is required' });
  
  // Cria um novo objeto item com os dados recebidos
  const item = { 
    id: nextId++,           // Atribui o próximo ID disponível e incrementa o contador
    title,                  // Título do item (obrigatório)
    body: body || '',       // Descrição (usa string vazia se não for fornecida)
    universe: universe || '', // Universo (valor padrão: string vazia)
    species: species || '', // Espécie (valor padrão: string vazia)
    imageUrl: imageUrl || '', // URL da imagem (valor padrão: string vazia)
    abilities: abilities || '' // Habilidades (valor padrão: string vazia)
  };
  
  // Adiciona o novo item ao array (simula inserção no banco de dados)
  items.push(item);
  
  // Retorna o item criado com status HTTP 201 (Created)
  // O status 201 indica que um novo recurso foi criado com sucesso
  res.status(201).json(item);
});

// Rota: PUT /api/items/:id
// Propósito: Atualizar um item existente pelo ID
// Método HTTP: PUT (atualização completa)
// Parâmetros: id (na URL) + dados atualizados (no corpo)
app.put('/api/items/:id', (req, res) => {
  // Converte o parâmetro :id da URL para número inteiro
  const id = parseInt(req.params.id, 10);
  
  // Encontra o índice do item no array (não o item em si)
  // findIndex retorna -1 se não encontrar
  const index = items.findIndex(i => i.id === id);
  
  // Se o índice for -1, o item não existe - retorna erro 404
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  // Extrai as propriedades do corpo da requisição
  const { title, body, universe, species, imageUrl, abilities } = req.body;
  
  // Atualiza o item existente usando spread operator (...)
  // O operador ?? (nullish coalescing) mantém o valor atual se o novo for null/undefined
  items[index] = { 
    ...items[index],                          // Copia todas as propriedades existentes
    title: title ?? items[index].title,       // Atualiza título apenas se fornecido
    body: body ?? items[index].body,          // Atualiza descrição apenas se fornecida
    universe: universe ?? items[index].universe, // Atualiza universo apenas se fornecido
    species: species ?? items[index].species, // Atualiza espécie apenas se fornecida
    imageUrl: imageUrl ?? items[index].imageUrl, // Atualiza URL da imagem apenas se fornecida
    abilities: abilities ?? items[index].abilities // Atualiza habilidades apenas se fornecidas
  };
  
  // Retorna o item atualizado em formato JSON
  res.json(items[index]);
});

// Rota: DELETE /api/items/:id
// Propósito: Remover um item do "banco de dados" pelo ID
// Método HTTP: DELETE
// Parâmetros: id (na URL)
app.delete('/api/items/:id', (req, res) => {
  // Converte o parâmetro :id da URL para número inteiro
  const id = parseInt(req.params.id, 10);
  
  // Encontra o índice do item no array
  const index = items.findIndex(i => i.id === id);
  
  // Se o índice for -1, o item não existe - retorna erro 404
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  // Remove o item do array usando splice()
  // splice(index, 1) remove 1 elemento a partir da posição 'index'
  // [0] acessa o primeiro elemento do array retornado (o item removido)
  const removed = items.splice(index, 1)[0];
  
  // Retorna o item removido em formato JSON
  // Isso permite ao cliente saber exatamente o que foi deletado
  res.json(removed);
});

// ==========================================
// ROTA PARA PÁGINA PRINCIPAL (FRONTEND)
// ==========================================

// Rota: GET /
// Propósito: Servir a página HTML principal do aplicativo
// Método HTTP: GET
app.get('/', (req, res) => {
  // Envia o arquivo index.html localizado no diretório 'public'
  // path.join() cria um caminho absoluto compatível com qualquer sistema operacional
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

// Define a porta onde o servidor vai escutar
// process.env.PORT: usa a porta definida nas variáveis de ambiente (útil para deployment)
// || 3000: fallback para porta 3000 se não estiver definida
const port = process.env.PORT || 3000;

// Inicia o servidor e faz ele escutar na porta especificada
// Quando o servidor estiver pronto, a função callback é executada
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
// A mensagem no console confirma que o servidor está rodando e mostra a URL de acesso