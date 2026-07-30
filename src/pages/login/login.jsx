import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Card, CardContent, Chip, Input } from '@heroui/react';
import {
  HiAcademicCap,
  HiArrowRight,
  HiBuildingOffice2,
  HiCalendarDays,
  HiEnvelope,
  HiLockClosed,
  HiMagnifyingGlass,
  HiQuestionMarkCircle,
  HiShieldCheck,
  HiUser,
  HiXMark,
} from 'react-icons/hi2';
import { toast } from 'sonner';
import {
  login,
  obtenerContextoUsuario,
  recperarPasswordService,
  reenviarVerificacion,
  registerUser,
} from '../../services/auth.services';
import { useAuthStore } from '../../store/authStore';
import { PasswordRequirements } from '../../components/auth/PasswordRequirements';
import AuthCheckbox from '../../components/auth/AuthCheckbox';
import { validateRegistration } from '../../validation/registration';

const FEATURES = [
  { icon: HiCalendarDays, title: 'Horarios', description: 'Tu jornada académica en un solo lugar.' },
  { icon: HiBuildingOffice2, title: 'Espacios', description: 'Consulta y reserva recursos del campus.' },
  { icon: HiMagnifyingGlass, title: 'Comunidad', description: 'Reporta y encuentra objetos perdidos.' },
];

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  icon: Icon,
  required = false,
  error,
}) => (
  <label className="block space-y-1.5">
    <span className="ml-1 block text-xs font-extrabold text-[#123B38]">{label}</span>
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#469D89]" />
      )}
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-label={label}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-2xl border bg-[#F4FAF7] text-sm text-[#123B38] outline-none transition focus:ring-4 ${
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-100'
            : 'border-[#D8EAE2] focus:border-[#358F80] focus:ring-[#99E2B4]/25'
        } ${
          Icon ? 'pl-11 pr-4 py-2.5' : 'px-4 py-2.5'
        }`}
      />
    </div>
    {error && <span role="alert" className="ml-1 block text-[11px] font-semibold text-rose-600">{error}</span>}
  </label>
);

export const LoginPages = () => {
  const [correo, setCorreo] = useState('ceandrade@espe.edu.ec');
  const [password, setPassword] = useState('espe2026');
  const [nombre, setNombre] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});
  const [mode, setMode] = useState('login');
  const [recordarme, setRecordarme] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const navigate = useNavigate();
  const saveSession = useAuthStore((state) => state.login);
  const setContexto = useAuthStore((state) => state.setContexto);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await login(correo, password);
      setVerificationPending(false);
      saveSession(data.usuario, data.token);
      try { const ctx = await obtenerContextoUsuario(); setContexto(ctx); } catch (_) {}
      toast.success('Bienvenido a ESPEConnect', {
        description: `Sesión iniciada como ${data.usuario.nombre}`,
      });
      navigate('/dashboard');
    } catch (error) {
      setVerificationPending(error.response?.data?.codigo === 'EMAIL_NO_VERIFICADO');
      toast.error('No pudimos iniciar sesión', {
        description: error.response?.data?.mensaje || 'Verifica tus credenciales y la conexión.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (loading) return;

    const validation = validateRegistration({
      nombre,
      correo,
      password,
      confirmPassword,
      acceptedTerms,
    });
    setRegisterErrors(validation.errors);
    if (!validation.valid) {
      toast.error('Revisa los campos señalados.');
      return;
    }

    setLoading(true);
    try {
      const registration = await registerUser(
        validation.values.nombre,
        validation.values.correo,
        validation.values.password,
      );
      toast.success('Cuenta creada correctamente', {
        description: registration.mensaje,
      });
      setMode('login');
      setNombre('');
      setConfirmPassword('');
      setAcceptedTerms(false);
      setRegisterErrors({});
    } catch (error) {
      const backendErrors = error.response?.data?.errores;
      if (backendErrors) setRegisterErrors((current) => ({ ...current, ...backendErrors }));

      const status = error.response?.status;
      const isTimeout = error.code === 'ECONNABORTED';
      const isConnectionError = !error.response;
      const title = isConnectionError
        ? 'El servidor no está disponible'
        : status === 429
          ? 'Demasiados intentos'
          : 'No pudimos crear la cuenta';
      const description = isTimeout
        ? 'El servidor tardó demasiado en responder. Comprueba que el backend siga ejecutándose en el puerto 3000.'
        : isConnectionError
          ? 'Levanta el backend con "cd server" y "npm run dev", y déjalo ejecutándose mientras usas la aplicación.'
          : error.response?.data?.mensaje || 'Revisa los datos e inténtalo nuevamente.';

      toast.error(title, {
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (event) => {
    event.preventDefault();
    if (recoveryLoading) return;
    setRecoveryLoading(true);
    try {
      await recperarPasswordService(recoveryEmail);
      toast.success('Solicitud recibida', {
        description: 'Si la cuenta existe, recibirás las instrucciones correspondientes.',
      });
      setRecoveryOpen(false);
      setRecoveryEmail('');
    } catch (error) {
      const retryAfter = Number(error.response?.headers?.['retry-after']);
      const retryMessage = retryAfter
        ? ` Inténtalo nuevamente en ${Math.max(1, Math.ceil(retryAfter / 60))} minuto(s).`
        : '';
      toast.error('No fue posible enviar la solicitud', {
        description: `${error.response?.data?.mensaje || 'Revisa la conexión e inténtalo nuevamente.'}${retryMessage}`,
      });
    } finally {
      setRecoveryLoading(false);
    }
  };

  const useDemo = (role) => {
    if (role === 'admin') { setCorreo('admin@espe.edu.ec'); setPassword('admin2026'); }
    else if (role === 'docente') { setCorreo('kjchuquitarko@espe.edu.ec'); setPassword('docente2026'); }
    else { setCorreo('ceandrade@espe.edu.ec'); setPassword('espe2026'); }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setNombre('');
    setConfirmPassword('');
    setAcceptedTerms(false);
    setRegisterErrors({});
    if (nextMode === 'register') {
      setCorreo('');
      setPassword('');
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4FAF7] p-2 sm:p-4 md:p-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#99E2B4]/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 h-[32rem] w-[32rem] rounded-full bg-[#56AB91]/30 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#D8EAE2] bg-white shadow-[0_30px_80px_rgba(3,102,102,0.12)] lg:grid-cols-[0.95fr_1.05fr] max-lg:rounded-none max-lg:border-0 max-lg:shadow-none">
        <section className="relative hidden overflow-hidden bg-[#036666] p-8 text-white lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(153,226,180,0.28),transparent_38%)]" />
          <div className="relative flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#99E2B4] text-[#036666]">
              <HiAcademicCap className="h-7 w-7" />
            </div>
            <div>
              <p className="font-heading text-xl font-extrabold">ESPEConnect</p>
              <p className="text-xs text-[#C8E8D7]">Campus digital universitario</p>
            </div>
          </div>

          <div className="relative my-12 max-w-xl">
            <Chip className="mb-4 bg-white/10 text-[#99E2B4]">Universidad ESPE</Chip>
            <h1 className="font-heading text-3xl font-extrabold leading-tight">
              Todo tu campus,
              <span className="block text-[#99E2B4]">más simple y conectado.</span>
            </h1>
            <p className="mt-4 max-w-lg text-xs leading-6 text-[#C8E8D7]">
              Organiza tus actividades, encuentra espacios disponibles y mantente al día desde una experiencia rápida e instalable.
            </p>

            <div className="mt-7 grid gap-2.5">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/7 p-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#99E2B4] text-[#036666]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">{title}</p>
                    <p className="mt-0.5 text-xs text-[#C8E8D7]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-[#C8E8D7]">Seguro · Accesible · Disponible sin conexión</p>
        </section>

        <section className="flex items-center justify-center px-4 py-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-[#036666] text-[#99E2B4]">
                <HiAcademicCap className="h-6 w-6" />
              </div>
              <p className="font-heading text-xl font-extrabold text-[#036666]">ESPEConnect</p>
            </div>

            <div className="mb-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#469D89]">
                {mode === 'login' ? 'Acceso institucional' : 'Nueva cuenta'}
              </p>
              <h2 className="mt-1.5 font-heading text-2xl font-extrabold text-[#123B38]">
                {mode === 'login' ? 'Bienvenido de nuevo' : 'Únete a ESPEConnect'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#52716B]">
                {mode === 'login'
                  ? 'Ingresa con tu correo institucional para continuar.'
                  : 'Regístrate con tus datos institucionales.'}
              </p>
            </div>

            <Card className="border border-[#D8EAE2] bg-white shadow-none">
              <CardContent className="p-5">
                <form onSubmit={mode === 'login' ? handleSubmit : handleRegister} className="space-y-3.5">
                  {mode === 'register' && (
                    <FormField
                      label="Nombre completo"
                      value={nombre}
                      onChange={(event) => {
                        setNombre(event.target.value);
                        setRegisterErrors((current) => ({ ...current, nombre: undefined }));
                      }}
                      placeholder="Ej. Carlos Eduardo Andrade"
                      autoComplete="name"
                      icon={HiUser}
                      required
                      error={registerErrors.nombre}
                    />
                  )}
                  <FormField
                    type="email"
                    label="Correo institucional"
                    value={correo}
                    onChange={(event) => {
                      setCorreo(event.target.value);
                      setRegisterErrors((current) => ({ ...current, correo: undefined }));
                    }}
                    placeholder="usuario@espe.edu.ec"
                    autoComplete="email"
                    icon={HiEnvelope}
                    required
                    error={mode === 'register' ? registerErrors.correo : undefined}
                  />
                  <FormField
                    type="password"
                    label="Contraseña"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setRegisterErrors((current) => ({ ...current, password: undefined }));
                    }}
                    placeholder={mode === 'login' ? 'Ingresa tu contraseña' : 'Crea una contraseña segura'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    icon={HiLockClosed}
                    required
                    error={mode === 'register' ? registerErrors.password : undefined}
                  />

                  {mode === 'register' ? (
                    <>
                      <PasswordRequirements password={password} />
                      <FormField
                        type="password"
                        label="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          setRegisterErrors((current) => ({ ...current, confirmPassword: undefined }));
                        }}
                        placeholder="Repite la contraseña"
                        autoComplete="new-password"
                        icon={HiLockClosed}
                        required
                        error={registerErrors.confirmPassword}
                      />
                      <AuthCheckbox
                        name="acceptedTerms"
                        checked={acceptedTerms}
                        onChange={(selected) => {
                          setAcceptedTerms(selected);
                          setRegisterErrors((current) => ({ ...current, acceptedTerms: undefined }));
                        }}
                        error={registerErrors.acceptedTerms}
                        description="Las cuentas creadas aquí reciben el rol Estudiante."
                      >
                        Acepto los términos de uso y la política de privacidad.
                      </AuthCheckbox>
                    </>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <AuthCheckbox
                        name="rememberMe"
                        checked={recordarme}
                        onChange={setRecordarme}
                      >
                        Recordarme
                      </AuthCheckbox>
                      <Button
                        variant="light"
                        size="sm"
                        onPress={() => setRecoveryOpen(true)}
                        className="px-2 text-xs font-bold text-[#14746F]"
                      >
                        ¿Olvidaste tu contraseña?
                      </Button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    isLoading={loading}
                    isDisabled={loading}
                    className="h-12 w-full rounded-2xl bg-[#036666] font-extrabold text-white shadow-lg shadow-[#036666]/15"
                    endContent={!loading && <HiArrowRight className="h-4 w-4" />}
                  >
                    {loading
                      ? mode === 'login' ? 'Autenticando…' : 'Creando cuenta…'
                      : mode === 'login' ? 'Acceder al sistema' : 'Crear cuenta'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {mode === 'login' && verificationPending && (
              <Button
                variant="light"
                className="mt-3 w-full text-xs font-extrabold text-[#14746F]"
                onPress={async () => {
                  try {
                    const data = await reenviarVerificacion(correo);
                    toast.success('Solicitud procesada', { description: data.mensaje });
                  } catch (error) {
                    toast.error(error.response?.data?.mensaje || 'No fue posible reenviar el correo.');
                  }
                }}
              >
                Reenviar correo de verificación
              </Button>
            )}

            <div className="mt-4 flex items-center justify-center gap-1 text-xs text-[#52716B]">
              <span>{mode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}</span>
              <Button
                variant="light"
                size="sm"
                onPress={() => changeMode(mode === 'login' ? 'register' : 'login')}
                className="px-2 text-xs font-extrabold text-[#14746F]"
              >
                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </Button>
            </div>

            {mode === 'login' && <div className="mt-4">
              <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6A8881]">Acceso rápido</p>
              <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-2">
                <Button
                  variant="flat"
                  onPress={() => useDemo('student')}
                  className="rounded-2xl bg-[#EAF6F0] text-[10px] font-bold text-[#036666] h-auto py-2"
                  startContent={<HiAcademicCap className="h-4 w-4 shrink-0" />}
                >
                  Estudiante
                </Button>
                <Button
                  variant="flat"
                  onPress={() => useDemo('docente')}
                  className="rounded-2xl bg-[#EAF6F0] text-[10px] font-bold text-[#036666] h-auto py-2"
                  startContent={<HiUser className="h-4 w-4 shrink-0" />}
                >
                  Docente
                </Button>
                <Button
                  variant="flat"
                  onPress={() => useDemo('admin')}
                  className="rounded-2xl bg-[#EAF6F0] text-[10px] font-bold text-[#036666] h-auto py-2"
                  startContent={<HiShieldCheck className="h-4 w-4 shrink-0" />}
                >
                  Admin
                </Button>
              </div>
            </div>}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {recoveryOpen && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.button
              aria-label="Cerrar recuperación"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRecoveryOpen(false)}
              className="absolute inset-0 bg-[#024E50]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="surface-card relative z-10 w-full max-w-md p-6"
            >
              <Button
                isIconOnly
                variant="light"
                onPress={() => setRecoveryOpen(false)}
                aria-label="Cerrar"
                className="absolute right-3 top-3 rounded-xl text-[#52716B]"
              >
                <HiXMark className="h-5 w-5" />
              </Button>
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-[#EAF6F0] text-[#036666]">
                <HiQuestionMarkCircle className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-[#123B38]">Recuperar acceso</h3>
              <p className="mt-1 text-sm text-[#52716B]">Ingresa tu correo institucional.</p>
              <form onSubmit={handleRecovery} className="mt-5 space-y-4">
                <FormField
                  type="email"
                  label="Correo institucional"
                  value={recoveryEmail}
                  onChange={(event) => setRecoveryEmail(event.target.value)}
                  placeholder="usuario@espe.edu.ec"
                  autoComplete="email"
                  icon={HiEnvelope}
                  required
                />
                <Button
                  type="submit"
                  isLoading={recoveryLoading}
                  isDisabled={recoveryLoading}
                  className="w-full rounded-2xl bg-[#036666] font-bold text-white"
                >
                  {recoveryLoading ? 'Enviando…' : 'Enviar solicitud'}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
