import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@heroui/react';
import {
  HiCheckCircle,
  HiEnvelope,
  HiExclamationTriangle,
  HiLockClosed,
} from 'react-icons/hi2';
import { PasswordRequirements } from '../../components/auth/PasswordRequirements';
import { restablecerPassword, verificarCorreo } from '../../services/auth.services';

export const AuthActionPage = ({ action }) => {
  const token = new URLSearchParams(useLocation().search).get('token') || '';
  const [status, setStatus] = useState(action === 'verify' ? 'loading' : 'form');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (action !== 'verify') return;
    if (verificationStarted.current) return;
    verificationStarted.current = true;
    if (!token) {
      setStatus('error');
      setMessage('El enlace de verificación no contiene un token válido.');
      return;
    }
    verificarCorreo(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.mensaje);
      })
      .catch((error) => {
        setStatus('error');
        setMessage(error.response?.data?.mensaje || 'No fue posible verificar el correo.');
      });
  }, [action, token]);

  const handleReset = async (event) => {
    event.preventDefault();
    if (password !== confirmation) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const data = await restablecerPassword(token, password);
      setStatus('success');
      setMessage(data.mensaje);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.mensaje || 'No fue posible restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const success = status === 'success';
  const Icon = success ? HiCheckCircle : status === 'error' ? HiExclamationTriangle : HiEnvelope;

  return (
    <main className="grid min-h-screen place-items-center bg-[#F4FAF7] p-4">
      <section className="surface-card w-full max-w-md p-6 sm:p-8">
        <div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${
          success ? 'bg-emerald-100 text-emerald-700' : status === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-[#EAF6F0] text-[#036666]'
        }`}>
          <Icon className="h-7 w-7" />
        </div>

        <h1 className="font-heading text-2xl font-extrabold text-[#123B38]">
          {action === 'verify' ? 'Verificación de correo' : 'Nueva contraseña'}
        </h1>

        {action === 'verify' && status === 'loading' && (
          <p className="mt-3 text-sm text-[#52716B]">Verificando tu cuenta…</p>
        )}

        {action === 'reset' && status === 'form' && (
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-extrabold text-[#123B38]">Nueva contraseña</span>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#469D89]" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  className="h-12 w-full rounded-2xl border border-[#D8EAE2] bg-[#F4FAF7] pl-11 pr-4 text-sm outline-none focus:border-[#358F80]"
                  required
                />
              </div>
            </label>
            <PasswordRequirements password={password} />
            <label className="block space-y-1.5">
              <span className="text-xs font-extrabold text-[#123B38]">Confirmar contraseña</span>
              <input
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="new-password"
                className="h-12 w-full rounded-2xl border border-[#D8EAE2] bg-[#F4FAF7] px-4 text-sm outline-none focus:border-[#358F80]"
                required
              />
            </label>
            {message && <p role="alert" className="text-xs font-semibold text-rose-600">{message}</p>}
            <Button
              type="submit"
              isLoading={loading}
              className="h-12 w-full rounded-2xl bg-[#036666] font-extrabold text-white"
            >
              Guardar nueva contraseña
            </Button>
          </form>
        )}

        {status !== 'form' && status !== 'loading' && (
          <>
            <p className="mt-3 text-sm leading-6 text-[#52716B]">{message}</p>
            <Button as={Link} to="/login" className="mt-6 w-full rounded-2xl bg-[#036666] font-bold text-white">
              Ir al inicio de sesión
            </Button>
          </>
        )}
      </section>
    </main>
  );
};
