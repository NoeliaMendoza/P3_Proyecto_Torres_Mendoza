import { HiCpuChip, HiUser } from 'react-icons/hi2';

export const AssistantMessage = ({ message }) => {
  const fromAssistant = message.role === 'assistant';
  return (
    <div className={`flex gap-2.5 ${fromAssistant ? '' : 'flex-row-reverse'}`}>
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
          fromAssistant ? 'bg-[#99E2B4] text-[#036666]' : 'bg-[#036666] text-white'
        }`}
      >
        {fromAssistant ? <HiCpuChip className="h-4 w-4" /> : <HiUser className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-xs leading-5 ${
          fromAssistant
            ? 'rounded-tl-md border border-[#D8EAE2] bg-[#F4FAF7] text-[#123B38]'
            : 'rounded-tr-md bg-[#036666] text-white'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
