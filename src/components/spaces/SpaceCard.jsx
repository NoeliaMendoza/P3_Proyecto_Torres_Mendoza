import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter, Button, Chip } from '@heroui/react';
import { 
  HiBuildingOffice2, 
  HiUsers, 
  HiClock, 
  HiCheckCircle, 
  HiXCircle, 
  HiWrenchScrewdriver,
  HiArrowRight
} from 'react-icons/hi2';

export const SpaceCard = ({ espacio, onReservar }) => {
  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'disponible':
        return (
          <Chip className="bg-[#008345] text-white font-extrabold text-xs" radius="full">
            <span className="flex items-center gap-1">
              <HiCheckCircle className="w-3.5 h-3.5" />
              Disponible
            </span>
          </Chip>
        );
      case 'ocupado':
        return (
          <Chip className="bg-rose-600 text-white font-extrabold text-xs" radius="full">
            <span className="flex items-center gap-1">
              <HiXCircle className="w-3.5 h-3.5" />
              Reservado
            </span>
          </Chip>
        );
      default:
        return (
          <Chip className="bg-amber-600 text-white font-extrabold text-xs" radius="full">
            <span className="flex items-center gap-1">
              <HiWrenchScrewdriver className="w-3.5 h-3.5" />
              Mantenimiento
            </span>
          </Chip>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white rounded-[28px] border border-[#E0E4DC] overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group p-0">
        {/* Image Banner */}
        <div className="relative h-52 w-full overflow-hidden bg-[#162E2B]">
          <img
            src={espacio.imagen}
            alt={espacio.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1E1C] via-[#0E1E1C]/20 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <Chip className="bg-[#162E2B]/90 text-white font-extrabold text-[10px] uppercase border border-white/20" radius="full">
              {espacio.tipo}
            </Chip>
            {getStatusBadge(espacio.estado)}
          </div>

          {/* Title over gradient */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h3 className="text-lg font-extrabold text-white leading-tight font-heading drop-shadow-xs">
              {espacio.nombre}
            </h3>
          </div>
        </div>

        {/* Body Info */}
        <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            {/* Location & Capacity Row */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[#586663] mb-3 font-semibold">
              <div className="flex items-center gap-1.5 truncate">
                <HiBuildingOffice2 className="w-4 h-4 text-[#008345] shrink-0" />
                <span className="truncate">{espacio.edificio}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <HiUsers className="w-4 h-4 text-[#008345] shrink-0" />
                <span>Cap: {espacio.capacidad} pers.</span>
              </div>
            </div>

            <p className="text-xs text-[#586663] leading-relaxed line-clamp-2">
              {espacio.descripcion}
            </p>

            {/* Equipments Tags */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {espacio.equipamiento.slice(0, 3).map((eq, i) => (
                <Chip
                  key={i}
                  className="bg-[#F2F4EF] text-[#264743] font-bold text-[11px] border border-[#E0E4DC]"
                  radius="full"
                >
                  {eq}
                </Chip>
              ))}
              {espacio.equipamiento.length > 3 && (
                <Chip
                  className="bg-[#E6F3EC] text-[#008345] font-bold text-[11px] border border-[#008345]/30"
                  radius="full"
                >
                  +{espacio.equipamiento.length - 3} más
                </Chip>
              )}
            </div>
          </div>

          {/* Card Action */}
          <div className="pt-4 border-t border-[#E0E4DC] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#586663] font-semibold">
              <HiClock className="w-4 h-4 text-[#264743]" />
              <span>{espacio.horario}</span>
            </div>

            <Button
              onClick={() => onReservar(espacio)}
              disabled={espacio.estado !== 'disponible'}
              className={`rounded-full text-xs font-extrabold transition-all shadow-xs px-4 py-2 ${
                espacio.estado === 'disponible'
                  ? 'bg-[#162E2B] hover:bg-[#008345] text-white'
                  : 'bg-[#E0E4DC] text-[#8A9693] cursor-not-allowed'
              }`}
            >
              <span>{espacio.estado === 'disponible' ? 'Reservar' : 'No disponible'}</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 ml-1">
                <HiArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
