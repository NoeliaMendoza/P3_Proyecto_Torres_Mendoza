const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:0.5b';

const toPlainText = (value = '') =>
  value
    .replace(/```[\w-]*\n?/g, '')
    .replace(/```/g, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^>\s?/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const requestOllama = async (path, options = {}) => {
  const response = await fetch(`${OLLAMA_URL}${path}`, {
    ...options,
    signal: AbortSignal.timeout(90_000),
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) {
    throw new Error(`Ollama respondió con estado ${response.status}.`);
  }
  return response.json();
};

const checkModel = async () => {
  const data = await requestOllama('/api/tags');
  return data.models?.some((item) => item.name === OLLAMA_MODEL) || false;
};

const chat = async ({ messages, system }) => {
  const data = await requestOllama('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      keep_alive: '10m',
      messages: [{ role: 'system', content: system }, ...messages],
      options: {
        temperature: 0.2,
        num_predict: 300,
      },
    }),
  });
  return toPlainText(data.message?.content);
};

module.exports = {
  chat,
  checkModel,
  model: OLLAMA_MODEL,
  toPlainText,
};
