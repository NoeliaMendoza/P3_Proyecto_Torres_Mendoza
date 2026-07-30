const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:0.5b';

const AI_PROVIDER = process.env.AI_PROVIDER || 'ollama';
const AI_API_KEY = process.env.AI_API_KEY || '';

// ─── Modo Ollama (local) ───────────────────────────────────────────
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

const ollamaCheck = async () => {
  const data = await requestOllama('/api/tags');
  return data.models?.some((item) => item.name === OLLAMA_MODEL) || false;
};

const ollamaChat = async ({ messages, system }) => {
  const data = await requestOllama('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      keep_alive: '10m',
      messages: [{ role: 'system', content: system }, ...messages],
      options: { temperature: 0.2, num_predict: 300 },
    }),
  });
  return toPlainText(data.message?.content);
};

// ─── Modo Cloud (OpenAI / Groq / Together) ────────────────────────
const providers = {
  openai: { baseURL: undefined, model: 'gpt-4o-mini' },
  groq: { baseURL: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  together: { baseURL: 'https://api.together.xyz/v1', model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
};

const config = providers[AI_PROVIDER] || providers.openai;
const cloudModel = process.env.AI_MODEL || config.model;
const isCloud = AI_PROVIDER !== 'ollama' && AI_API_KEY.length > 0;

let _client = null;
const getClient = () => {
  if (!_client) {
    const OpenAI = require('openai');
    _client = new OpenAI({ apiKey: AI_API_KEY, baseURL: process.env.AI_BASE_URL || config.baseURL });
  }
  return _client;
};

const cloudCheck = async () => {
  try {
    const models = await getClient().models.list();
    return models.data?.length > 0;
  } catch {
    return false;
  }
};

const cloudChat = async ({ messages, system }) => {
  const completion = await getClient().chat.completions.create({
    model: cloudModel,
    messages: [
      { role: 'system', content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.2,
    max_tokens: 300,
  });
  return toPlainText(completion.choices[0]?.message?.content || '');
};

// ─── Utilitario compartido ─────────────────────────────────────────
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

// ─── Exportaciones ─────────────────────────────────────────────────
const model = isCloud ? cloudModel : OLLAMA_MODEL;
const local = !isCloud;

const checkModel = isCloud ? cloudCheck : ollamaCheck;
const chat = isCloud ? cloudChat : ollamaChat;

module.exports = {
  chat,
  checkModel,
  local,
  model,
  toPlainText,
};