import { HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import { getPasswordChecks } from '../../validation/registration';

export const PasswordRequirements = ({ password }) => (
  <div className="rounded-2xl border border-[#D8EAE2] bg-[#F4FAF7] px-4 py-3" aria-live="polite">
    <p className="mb-2 text-[11px] font-extrabold text-[#123B38]">Tu contraseña debe incluir:</p>
    <ul className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-2">
      {getPasswordChecks(password).map(({ key, label, valid }) => {
        const Icon = valid ? HiCheckCircle : HiXCircle;
        return (
          <li
            key={key}
            className={`flex items-center gap-1.5 text-[10px] font-semibold ${
              valid ? 'text-[#248277]' : 'text-[#6A8881]'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {label}
          </li>
        );
      })}
    </ul>
  </div>
);
