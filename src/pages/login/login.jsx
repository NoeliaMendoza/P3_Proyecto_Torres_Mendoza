import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiAcademicCap, 
  HiEnvelope, 
  HiLockClosed, 
  HiArrowRight, 
  HiCheckCircle, 
  HiShieldCheck, 
  HiQuestionMarkCircle,
  HiXMark
} from 'react-icons/hi2';
import { toast } from 'sonner';
import { login, recperarPasswordService } from '../../services/auth.services';
import { useAuthStore } from '../../store/authStore';

export const LoginPages = () => {
  const [correo, setCorreo] = useState('ceandrade@espe.edu.ec');
  const [password, setPassword] = useState('espe2026');
  const [recordarme, setRecordarme] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalForgotOpen, setModalForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(correo, password);
      loginStore(data.usuario, data.token);
      toast.success('¡Bienvenido a ESPEConnect!', {
        description: `Sesión iniciada como ${data.usuario.nombre}`
      });
      navigate('/dashboard');
    } catch (err) {
      toast.error('Error de autenticación', {
        description: 'Verifique su correo institucional y contraseña.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStudent = () => {
    setCorreo('ceandrade@espe.edu.ec');
    setPassword('espe2026');
  };

  const fillDemoAdmin = () => {
    setCorreo('admin@espe.edu.ec');
    setPassword('admin2026');
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await recperarPasswordService(forgotEmail);
    toast.success('Solicitud enviada', {
      description: `Se han enviado las instrucciones de recuperación a ${forgotEmail}`
    });
    setModalForgotOpen(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-[#10201E] flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] border border-[#264743]/50">
        
        {/* Left Side: Institutional Graphic Banner (7 cols) */}
        <div className="lg:col-span-7 bg-[#162E2B] p-8 lg:p-12 text-white relative flex flex-col justify-between overflow-hidden">
          {/* Background Image / Pattern overlay inspired by the reference design */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#008345]/30 via-transparent to-transparent" />
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#008345]/20 blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#008345] flex items-center justify-center text-white shadow-lg border border-emerald-400/30">
              <HiAcademicCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight font-heading">
                ESPE<span className="text-[#36D080]">Connect</span>
              </h1>
              <p className="text-xs text-[#9EB0AA] font-semibold">
                Universidad de las Fuerzas Armadas ESPE
              </p>
            </div>
          </div>

          {/* Center Graphic Details */}
          <div className="relative z-10 my-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#008345]/20 border border-[#008345]/40 text-[#36D080] text-xs font-extrabold">
              <HiShieldCheck className="w-4 h-4 text-[#36D080]" />
              Plataforma Única de Campus Digital
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight font-heading">
              Conectando estudiantes con el campus inteligente.
            </h2>
            <p className="text-sm text-[#D1D9D6] leading-relaxed max-w-md">
              Gestiona tus reservas de espacios académicos, consulta la biblioteca, reporta objetos perdidos y mantente informado con alertas en tiempo real.
            </p>

            {/* Feature highlight pill cards */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-xs font-extrabold text-[#36D080] block mb-1">Reserva Instantánea</span>
                <span className="text-[11px] text-[#B0BFBB] font-medium">Laboratorios, auditorios y cubículos.</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-xs font-extrabold text-[#36D080] block mb-1">Objetos Perdidos</span>
                <span className="text-[11px] text-[#B0BFBB] font-medium">Comunidad de recuperación del campus.</span>
              </div>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="relative z-10 text-xs text-[#8EA09A] font-semibold border-t border-white/10 pt-4 flex items-center justify-between">
            <span>© 2026 Universidad de las Fuerzas Armadas ESPE</span>
            <span className="text-[#36D080] font-extrabold">Matriz Sangolquí</span>
          </div>
        </div>

        {/* Right Side: Login Form (5 cols) */}
        <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-[#0F1A19] font-heading">Iniciar Sesión</h3>
              <p className="text-xs text-[#586663] font-semibold mt-1">
                Ingresa con tu correo institucional @espe.edu.ec
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#0F1A19] mb-1.5">
                  Correo Institucional
                </label>
                <div className="relative">
                  <HiEnvelope className="w-4 h-4 text-[#586663] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="estudiante@espe.edu.ec"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-[#F2F4EF] border border-[#E0E4DC] rounded-2xl text-xs font-semibold text-[#0F1A19] placeholder-[#8A9693] focus:outline-none focus:ring-2 focus:ring-[#008345]/30 focus:border-[#008345] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#0F1A19] mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <HiLockClosed className="w-4 h-4 text-[#586663] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-[#F2F4EF] border border-[#E0E4DC] rounded-2xl text-xs font-semibold text-[#0F1A19] placeholder-[#8A9693] focus:outline-none focus:ring-2 focus:ring-[#008345]/30 focus:border-[#008345] transition-all"
                  />
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#586663] font-semibold">
                  <input
                    type="checkbox"
                    checked={recordarme}
                    onChange={(e) => setRecordarme(e.target.checked)}
                    className="w-4 h-4 text-[#008345] rounded-md border-[#E0E4DC] focus:ring-[#008345]"
                  />
                  Recordarme
                </label>
                <button
                  type="button"
                  onClick={() => setModalForgotOpen(true)}
                  className="font-bold text-[#008345] hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Submit Pill Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#008345] hover:bg-[#006636] text-white font-extrabold text-xs rounded-full shadow-lg shadow-[#008345]/20 flex items-center justify-center gap-2 transition-all mt-2"
              >
                <span>{loading ? 'Autenticando...' : 'Acceder al Sistema'}</span>
                <HiArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Fill Demo Helpers */}
          <div className="mt-6 pt-5 border-t border-[#E0E4DC]">
            <p className="text-[11px] font-extrabold text-[#586663] uppercase tracking-wider mb-2">
              Credenciales de Prueba Rápida
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoStudent}
                className="px-3.5 py-2.5 rounded-full text-[11px] font-extrabold bg-[#F2F4EF] hover:bg-[#E6F3EC] text-[#162E2B] border border-[#E0E4DC] transition-all text-center truncate"
              >
                Modo Estudiante
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="px-3.5 py-2.5 rounded-full text-[11px] font-extrabold bg-[#F2F4EF] hover:bg-[#E6F3EC] text-[#162E2B] border border-[#E0E4DC] transition-all text-center truncate"
              >
                Modo Administrador
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {modalForgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalForgotOpen(false)}
              className="fixed inset-0 bg-[#0E1E1C]/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-[32px] p-6 w-full max-w-md shadow-2xl border border-[#E0E4DC] z-10"
            >
              <button
                onClick={() => setModalForgotOpen(false)}
                className="absolute top-4 right-4 p-1 text-[#586663] hover:text-[#0F1A19] rounded-lg"
              >
                <HiXMark className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-[#E6F3EC] text-[#008345] rounded-2xl">
                  <HiQuestionMarkCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#0F1A19] font-heading">Recuperación de Contraseña</h4>
                  <p className="text-xs text-[#586663] font-semibold">Ingresa tu correo institucional</p>
                </div>
              </div>
              <form onSubmit={handleForgotSubmit} className="space-y-4 mt-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="ejemplo@espe.edu.ec"
                  required
                  className="w-full px-4 py-2.5 bg-[#F2F4EF] border border-[#E0E4DC] rounded-2xl text-xs font-semibold text-[#0F1A19] focus:ring-2 focus:ring-[#008345]/30 focus:border-[#008345]"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#008345] hover:bg-[#006636] text-white font-extrabold text-xs rounded-full shadow-md transition-all"
                >
                  Enviar Código de Recuperación
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
