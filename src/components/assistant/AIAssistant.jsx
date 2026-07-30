import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HiArrowPath,
  HiChatBubbleLeftEllipsis,
  HiCpuChip,
  HiPaperAirplane,
  HiXMark,
} from 'react-icons/hi2';
import { askLocalAssistant, getAIStatus } from '../../services/ai.services';
import { AssistantMessage } from './AssistantMessage';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Hola, soy el asistente local de ESPEConnect. Puedo ayudarte con espacios, horarios, reservas y objetos perdidos.',
};

const SUGGESTIONS = [
  '¿Cuáles son mis próximas reservas?',
  '¿Qué espacios tienen computadoras?',
  '¿Cómo reservo un espacio?',
];

export const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('checking');
  const [model, setModel] = useState('qwen2.5:0.5b');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const checkStatus = async () => {
    setStatus('checking');
    try {
      const data = await getAIStatus();
      setModel(data.model);
      setStatus(data.available ? 'online' : 'offline');
    } catch (_error) {
      setStatus('offline');
    }
  };

  useEffect(() => {
    if (open) checkStatus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const sendQuestion = async (text = question) => {
    const cleanQuestion = text.trim();
    if (!cleanQuestion || sending) return;

    const userMessage = { role: 'user', content: cleanQuestion };
    const previousMessages = messages.slice(1);
    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setSending(true);

    try {
      const data = await askLocalAssistant(cleanQuestion, previousMessages);
      setMessages((current) => [...current, { role: 'assistant', content: data.answer }]);
      setStatus('online');
    } catch (error) {
      setStatus('offline');
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: error.response?.data?.mensaje || 'No pude comunicarme con Ollama. Verifica que esté iniciado.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendQuestion();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir asistente de inteligencia artificial"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 z-40 grid h-12 w-12 place-items-center rounded-2xl bg-[#036666] text-[#99E2B4] shadow-[0_16px_40px_rgba(3,102,102,0.3)] transition hover:scale-105 hover:bg-[#14746F] sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
      >
        <HiChatBubbleLeftEllipsis className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar asistente"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-[#024E50]/35 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-50 flex h-[min(680px,calc(100dvh-1rem))] flex-col overflow-hidden rounded-[24px] border border-[#D8EAE2] bg-white shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[410px] sm:rounded-[28px]"
            >
              <header className="flex items-center gap-3 bg-[#036666] p-4 text-white">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#99E2B4] text-[#036666]">
                  <HiCpuChip className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading text-sm font-extrabold">Asistente ESPEConnect</h2>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#C8E8D7]">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        status === 'online'
                          ? 'bg-[#99E2B4]'
                          : status === 'checking'
                            ? 'animate-pulse bg-amber-300'
                            : 'bg-rose-300'
                      }`}
                    />
                    {status === 'online' ? `${model} · local` : status === 'checking' ? 'Comprobando…' : 'Ollama no disponible'}
                  </div>
                </div>
                {status === 'offline' && (
                  <button
                    type="button"
                    onClick={checkStatus}
                    aria-label="Reintentar conexión con Ollama"
                    className="rounded-xl p-2 text-[#C8E8D7] hover:bg-white/10"
                  >
                    <HiArrowPath className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar asistente"
                  className="rounded-xl p-2 text-[#C8E8D7] hover:bg-white/10"
                >
                  <HiXMark className="h-5 w-5" />
                </button>
              </header>

              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <AssistantMessage key={`${message.role}-${index}`} message={message} />
                ))}
                {sending && (
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#52716B]">
                    <HiCpuChip className="h-4 w-4 animate-pulse text-[#358F80]" />
                    El modelo local está pensando…
                  </div>
                )}
              </div>

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendQuestion(suggestion)}
                      className="rounded-full border border-[#D8EAE2] bg-[#F4FAF7] px-3 py-1.5 text-[10px] font-bold text-[#14746F] hover:border-[#78C6A3]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-[#D8EAE2] bg-[#F4FAF7] p-3">
                <div className="flex items-end gap-2 rounded-2xl border border-[#D8EAE2] bg-white p-2 focus-within:border-[#358F80]">
                  <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value.slice(0, 500))}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    placeholder="Pregunta sobre el campus…"
                    aria-label="Pregunta para el asistente"
                    className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-1 text-xs leading-5 text-[#123B38] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => sendQuestion()}
                    disabled={!question.trim() || sending}
                    aria-label="Enviar pregunta"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#036666] text-white transition hover:bg-[#14746F] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <HiPaperAirplane className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-center text-[9px] font-semibold text-[#6A8881]">
                  IA local · Puede equivocarse · Las acciones requieren confirmación manual
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
