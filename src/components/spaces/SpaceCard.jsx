import { motion } from 'framer-motion';
import { Card, CardContent } from '@heroui/react';
import { 
  HiBuildingOffice2, 
  HiUsers, 
  HiCheckCircle, 
  HiXCircle, 
  HiWrenchScrewdriver,
  HiComputerDesktop,
  HiVideoCamera,
  HiArrowRight
} from 'react-icons/hi2';

export const SpaceCard = ({ espacio, onReservar }) => {
  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'disponible':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#358F80] text-white">
            <HiCheckCircle className="w-3.5 h-3.5" />
            Disponible
          </span>
        );
      case 'ocupado':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white">
            <HiXCircle className="w-3.5 h-3.5" />
            Reservado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-600 text-white">
            <HiWrenchScrewdriver className="w-3.5 h-3.5" />
            Mantenimiento
          </span>
        );
    }
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="bg-white rounded-[28px] border border-[#D8EAE2] overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group p-0">
        <div className="bg-[#036666] p-6 text-white relative">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#358F80]/40 text-[#99E2B4] border border-[#358F80]/60 uppercase tracking-wider">
              {espacio.tipo_espacio}
            </span>
            {getStatusBadge(espacio.estado)}
          </div>
          <h3 className="text-lg font-extrabold leading-tight font-heading mt-2">
            {espacio.codigo} - {espacio.nombre}
          </h3>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#52716B] mb-3 font-semibold">
              <div className="flex items-center gap-1.5 truncate">
                <HiBuildingOffice2 className="w-4 h-4 text-[#358F80] shrink-0" />
                <span className="truncate">{espacio.edificio} {espacio.piso ? `- Piso ${espacio.piso}` : ''}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <HiUsers className="w-4 h-4 text-[#358F80] shrink-0" />
                <span>Cap: {espacio.capacidad} pers.</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {espacio.tiene_proyector && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#F4FAF7] text-[#248277] border border-[#D8EAE2] flex items-center gap-1">
                  <HiVideoCamera className="w-3 h-3" /> Proyector
                </span>
              )}
              {espacio.tiene_computadoras && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#F4FAF7] text-[#248277] border border-[#D8EAE2] flex items-center gap-1">
                  <HiComputerDesktop className="w-3 h-3" /> Computadoras
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#D8EAE2] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#52716B] font-semibold">
              <span>07:00 - 17:00</span>
            </div>

            <button
              onClick={() => onReservar(espacio)}
              disabled={espacio.estado !== 'disponible'}
              className={`rounded-full text-xs font-extrabold transition-all shadow-xs px-4 py-2 inline-flex items-center gap-1 ${
                espacio.estado === 'disponible'
                  ? 'bg-[#036666] hover:bg-[#358F80] text-white'
                  : 'bg-[#D8EAE2] text-[#6A8881] cursor-not-allowed'
              }`}
            >
              <span>{espacio.estado === 'disponible' ? 'Reservar' : 'No disponible'}</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 ml-1">
                <HiArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};