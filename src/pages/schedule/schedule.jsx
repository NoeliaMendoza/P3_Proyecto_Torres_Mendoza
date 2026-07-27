import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input, Chip, Spinner } from '@heroui/react';
import { obtenerHorarios } from '../../services/horarios.services';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const HORAS = Array.from({ length: 12 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

const COLORS = [
  { bg: '#dbeafe', text: '#1d4ed8', border: '#3b82f6' },
  { bg: '#dcfce7', text: '#15803d', border: '#22c55e' },
  { bg: '#fce7f3', text: '#be185d', border: '#ec4899' },
  { bg: '#fef3c7', text: '#b45309', border: '#f59e0b' },
  { bg: '#ede9fe', text: '#6d28d9', border: '#8b5cf6' },
  { bg: '#ccfbf1', text: '#0f766e', border: '#14b8a6' },
  { bg: '#ffedd5', text: '#c2410c', border: '#f97316' },
  { bg: '#e0e7ff', text: '#4338ca', border: '#6366f1' },
];

function solapamiento(a1, a2, b1, b2) {
  return a1 < b2 && b1 < a2;
}

export const SchedulePages = () => {
  const [search, setSearch] = useState('');

  const { data: horarios = [], isLoading } = useQuery({
    queryKey: ['horarios', 'todos'],
    queryFn: () => obtenerHorarios(),
  });

  const grid = useMemo(() => {
    if (!horarios.length) return [];

    const filtered = search
      ? horarios.filter((h) =>
          h.asignatura?.toLowerCase().includes(search.toLowerCase()) ||
          h.docente?.toLowerCase().includes(search.toLowerCase()) ||
          h.codigo_espacio?.toLowerCase().includes(search.toLowerCase()) ||
          h.carrera?.toLowerCase().includes(search.toLowerCase())
        )
      : horarios;

    const usedColors = {};
    let colorIndex = 0;
    const getColor = (asig) => {
      if (!usedColors[asig]) { usedColors[asig] = COLORS[colorIndex % COLORS.length]; colorIndex++; }
      return usedColors[asig];
    };

    const slots = [];
    for (const hora of HORAS) {
      const row = { hora, celdas: [] };
      for (let d = 0; d < 5; d++) {
        const diaNum = d + 1;
        const fin = `${String(parseInt(hora) + 1).padStart(2, '0')}:00`;
        const clases = filtered.filter((h) =>
          h.dia_semana === diaNum && solapamiento(h.hora_inicio?.slice(0, 5), h.hora_fin?.slice(0, 5), hora, fin)
        );
        row.celdas.push(clases.map((c) => ({ ...c, color: getColor(c.asignatura) })));
      }
      slots.push(row);
    }
    return slots;
  }, [horarios, search]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Horarios</h1>
        <p className="text-sm text-slate-500 mt-1">Consulta los horarios académicos</p>
      </div>

      <div className="mb-6">
        <Input type="text" placeholder="Buscar por asignatura, docente, espacio o carrera..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="sticky left-0 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-500 border-r border-slate-200 min-w-[60px]">Hora</th>
                {DIAS.map((d) => <th key={d} className="px-3 py-2 text-center text-xs font-semibold text-slate-500 border-r border-slate-200">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {grid.map((row) => (
                <tr key={row.hora} className="border-t border-slate-100">
                  <td className="sticky left-0 bg-white px-3 py-3 text-xs font-medium text-slate-400 border-r border-slate-200">{row.hora}</td>
                  {row.celdas.map((clases, i) => (
                    <td key={i} className="px-1 py-1 border-r border-slate-100 align-top">
                      {clases.length === 0 && <div className="h-8" />}
                      {clases.map((c, j) => (
                        <div key={j}
                          className="rounded-md px-2 py-1.5 mb-1 text-xs leading-tight"
                          style={{ backgroundColor: c.color.bg, borderLeft: `3px solid ${c.color.border}` }}>
                          <div className="font-semibold" style={{ color: c.color.text }}>{c.asignatura}</div>
                          <div className="text-slate-500">{c.codigo_espacio}</div>
                          <div className="text-slate-400 truncate">{c.docente}</div>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
              {grid.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-sm text-slate-400">No hay horarios registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
