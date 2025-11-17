# **Pokémon & Hora de Aventura — CRUD + Consumo de APIs Externas**

Este projeto é uma aplicação web que integra dois universos — **Pokémon** e **Hora de Aventura** — permitindo:

* Buscar personagens usando **APIs externas** (PokéAPI e Adventure Time API)
* Criar, editar e excluir personagens usando uma **API interna (Node.js + Express)**
* Combinar dois personagens para gerar **histórias mágicas cruzando universos**
* Visualizar todos os personagens cadastrados em uma lista dinâmica

O sistema funciona totalmente no navegador (frontend) e se comunica com um servidor Node.js (backend).

---

# **📂 Estrutura do Projeto**

```
/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
└── package.json
```

### **📌 Descrição dos arquivos**

| Arquivo        | Função                                                                               |
| -------------- | ------------------------------------------------------------------------------------ |
| **index.html** | Estrutura principal da interface do usuário                                          |
| **style.css**  | Estilos visuais da aplicação                                                         |
| **script.js**  | Lógica do frontend: consumo das APIs externas, integração com API interna, CRUD e UI |
| **server.js**  | Servidor Node.js + Express contendo a API interna                                    |
| **public/**    | Pasta estática servida pelo backend                                                  |

---

# **🚀 Como Executar o Projeto**

### 1️⃣ Instalar dependências

No terminal:

```bash
npm install
```

### 2️⃣ Rodar o servidor

```bash
node server.js
```

### 3️⃣ Abrir o navegador e acessar:

```
http://localhost:3000
```

---

# **🧠 Como o Projeto Funciona (Visão Geral)**

A aplicação possui **3 partes principais**:

---

## **1. APIs Externas**

O frontend busca personagens de:

### 🟦 PokéAPI

Endpoint usado:

```
https://pokeapi.co/api/v2/pokemon
```

Obtém:

* nome
* sprites (imagem)
* habilidades
* tipos (espécies em Pokémon)

---

### 🟨 Adventure Time API

Endpoint usado:

```
https://api.sampleapis.com/adventuretime/characters
```

Obtém:

* nome
* imagem (quando disponível)
* espécie
* descrição
* habilidades (se existirem)

---

## **2. API Interna (server.js)**

O servidor fornece um CRUD completo:

| Método     | Rota             | Função                           |
| ---------- | ---------------- | -------------------------------- |
| **GET**    | `/api/items`     | Lista todos os personagens       |
| **GET**    | `/api/items/:id` | Retorna um personagem específico |
| **POST**   | `/api/items`     | Cria um novo personagem          |
| **PUT**    | `/api/items/:id` | Atualiza um personagem           |
| **DELETE** | `/api/items/:id` | Remove um personagem             |

O servidor também serve os arquivos estáticos em `public/`.

---

## **3. Frontend (script.js)**

O script controla toda a lógica:

* Carregar lista interna ao iniciar
* Preencher selects conforme universo escolhido
* Carregar personagens das APIs externas
* Preencher formulário automaticamente
* Criar novo personagem
* Editar personagem existente
* Apagar personagem
* Criar histórias combinando personagens
* Tratar erros e mostrar alertas
* Habilitar/desabilitar botões conforme necessidade

---

# **📌 Documentação Completa do Backend (API Interna)**

### **GET /api/items**

Retorna a lista de personagens cadastrados.

Exemplo de resposta:

```json
[
  {
    "id": 1,
    "title": "Pikachu",
    "body": "Pokémon elétrico",
    "universe": "pokemon",
    "species": "Pokémon",
    "imageUrl": "...",
    "abilities": "Choque do Trovão, Velocidade"
  }
]
```

---

### **GET /api/items/:id**

Retorna um personagem específico.
Retorna **404** se não existir.

---

### **POST /api/items**

Cria um novo personagem.

Exemplo de envio:

```json
{
  "title": "Finn",
  "body": "Herói aventureiro",
  "universe": "aventura",
  "species": "Humano",
  "imageUrl": "",
  "abilities": "Espada, Coragem"
}
```

Retorno: objeto criado com novo id.

---

### **PUT /api/items/:id**

Atualiza apenas os campos enviados.

---

### **DELETE /api/items/:id**

Remove personagem.

---

# **📌 Documentação do Frontend (script.js)**

A seguir está a explicação detalhada de todas as partes importantes do script.

---

## 🔹 **Variáveis Globais**

| Variável               | Função                                                 |
| ---------------------- | ------------------------------------------------------ |
| `API_CONFIG`           | URLs das APIs externas                                 |
| `characters`           | Lista de personagens cadastrados na API interna        |
| `editingId`            | Armazena o ID do personagem sendo editado              |
| `currentApiCharacters` | Lista de personagens vindos da API externa selecionada |

---

## 🔹 **Fluxo Geral do Script**

1. Ao carregar a página:

   * busca personagens internos (`loadItems()`)
   * preenche selects da aba de história
   * aguarda interação do usuário

2. Usuário escolhe um universo (Pokémon ou Aventura)

   * script busca lista da API correspondente
   * preenche o select de personagens

3. Usuário seleciona um personagem

   * detalhes desse personagem são carregados no formulário

4. Usuário pode salvar (criar ou editar)

   * dados enviados ao backend via POST ou PUT

5. A tabela de personagens é atualizada automaticamente

6. É possível:

   * editar qualquer item
   * excluir
   * gerar história combinada

---

# **📝 Detalhamento de Funções do script.js**

### **loadItems()**

Carrega todos os personagens da API interna e atualiza:

* tabela da listagem
* selects usados na criação de histórias

---

### **resetForm()**

Limpa campos, desabilita botão de salvar, esconde estado de edição.

---

### **loadExternalUniverse(universe)**

Carrega personagens da API externa escolhida:

* PokéAPI → carrega primeiros 150 Pokémon
* Adventure Time → carrega todos os personagens da API

Popula o select `#characterSelect`.

---

### **fillFormWithAPICharacter(character)**

Insere no formulário:

* nome
* descrição
* habilidades
* espécie
* imagem

---

### **saveItem()**

Decide se é:

* **POST** (criar) ou
* **PUT** (editar)

Conforme `editingId`.

---

### **editItem(id)**

Carrega o personagem no formulário para edição imediata.

---

### **deleteItem(id)**

Remove após confirmação.

---

### **generateStory()**

Combina dois personagens da lista interna e cria uma história aleatória e mágica usando estilo narrativo.

---

# **🎨 COMO USAR? - Interface do Usuário (Resumo)**

### **🔍 1. Busca em API externa**

O usuário escolhe:

* Universo → personagem → botão “Carregar no Formulário”

Isso preenche automaticamente os campos.

---

### **📝 2. Formulário de criação/edição**

O usuário pode:

* Criar novos personagens
* Editar personagens existentes
* Sobrescrever dados vindos da API externa
* Cancelar operação

---

### **📋 3. Lista de personagens**

A tabela exibe:

* ID
* Nome
* Universo
* Espécie
* Descrição
* Habilidades
* Ações (editar ou excluir)

---

### **📚 4. Criador de histórias mágicas**

Seleciona dois personagens e cria automaticamente uma história cruzada.

---

# **⚠ Possíveis Erros & Soluções**

| Erro                                   | Causa                      | Solução                            |
| -------------------------------------- | -------------------------- | ---------------------------------- |
| Botão "Salvar Personagem" desabilitado | Campos obrigatórios vazios | Preencher nome, universo e espécie |
| Nada aparece ao buscar API externa     | API caiu                   | Tentar novamente, trocar universo  |
| Imagem não aparece                     | API não fornece imagem     | O usuário pode colar manualmente   |
| Lista interna vazia                    | Server.js não está rodando | Rodar `node server.js`             |

---

# **📜 Licença**

Uso livre para fins educacionais e projetos acadêmicos.