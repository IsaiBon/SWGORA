const fs = require('fs');
const path = require('path');

function getCredentials() {
  const envPath = path.resolve(__dirname, '..', '.env.trello');
  if (!fs.existsSync(envPath)) {
    throw new Error('No se encontró el archivo .env.trello');
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = Object.fromEntries(
    content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => {
        const idx = l.indexOf('=');
        return [l.slice(0, idx), l.slice(idx + 1)];
      })
  );
  return {
    key: env.TRELLO_API_KEY,
    token: env.TRELLO_TOKEN,
  };
}

async function trelloFetch(endpoint, options = {}) {
  const { key, token } = getCredentials();
  const sep = endpoint.includes('?') ? '&' : '?';
  const url = `https://api.trello.com/1${endpoint}${sep}key=${key}&token=${token}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`[Trello Error ${res.status}]: ${errorText}`);
  }
  return res.json();
}

async function getBoards() {
  return trelloFetch('/members/me/boards?fields=name,url,closed');
}

async function getBoardLists(boardId) {
  return trelloFetch(`/boards/${boardId}/lists`);
}

async function getListCards(listId) {
  return trelloFetch(`/lists/${listId}/cards?fields=name,desc,due,idList,url`);
}

async function moveCard(cardId, targetListId) {
  return trelloFetch(`/cards/${cardId}?idList=${targetListId}`, {
    method: 'PUT',
  });
}

async function createCard(listId, name, desc = '') {
  return trelloFetch(`/cards?idList=${listId}&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}`, {
    method: 'POST',
  });
}

async function addComment(cardId, commentText) {
  return trelloFetch(`/cards/${cardId}/actions/comments?text=${encodeURIComponent(commentText)}`, {
    method: 'POST',
  });
}

async function updateCard(cardId, data) {
  const params = new URLSearchParams(data).toString();
  return trelloFetch(`/cards/${cardId}?${params}`, {
    method: 'PUT',
  });
}

module.exports = {
  trelloFetch,
  getBoards,
  getBoardLists,
  getListCards,
  moveCard,
  createCard,
  updateCard,
  addComment,
};
