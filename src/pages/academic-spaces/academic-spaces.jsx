import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input,
  Modal, ModalDialog, ModalHeader, ModalHeading, ModalBody, ModalCloseTrigger,
  Chip, Spinner
} from '@heroui/react';
import { obtenerEspacios, obtenerTiposEspacio, obtenerDisponibilidad } from '../../services/espacios.services';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const DetalleModal = ({ espacio, onClose }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['disponibilidad', espacio.id],
    queryFn: () => obtenerDisponibilidad(espacio.id),
    enabled: !!espacio,
  });

  const horarios = data?.horarios || [];

  return (
    <Modal state={{ isOpen: !!espacio, setOpen: (v) => { if (!v) onClose(); } }}>
      <Modal.Backdrop />
      <Modal.Container>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>{espacio.nombre}</Modal.Heading>
            <Modal.CloseTrigger />
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><span className="text-sm text-slate-500">Código</span><p className="font-medium">{espacio.codigo}</p></div>
              <div><span className="text-sm text-slate-500">Tipo</span><p className="font-medium">{espacio.tipo_espacio}</p></div>
              <div><span className="text-sm text-slate-500">Ubicación</span><p className="font-medium">{espacio.edificio} P{espacio.piso}</p></div>
              <div><span className="text-sm text-slate-500">Capacidad</span><p className="font-medium">{espacio.capacidad} personas</p></div>
              <div><span className="text-sm text-slate-500">Estado</span>
                <Chip color={espacio.estado === 'disponible' ? 'success' : 'danger'} variant="soft" size="sm">
                  {espacio.estado === 'disponible' ? 'Disponible' : 'Mantenimiento'}
                </Chip>
              </div>
              <div><span className="text-sm text-slate-500">Equipamiento</span>
                <p className="font-medium">
                  {[espacio.tiene_proyector && 'Proyector', espacio.tiene_computadoras && 'Computadoras'].filter(Boolean).join(', ') || 'Ninguno'}
                </p>
              </div>
            </div>

            {isLoading && <Spinner size="sm" />}
            {!isLoading && horarios.length > 0 && (
              <>
                <h3 className="text-base font-semibold text-slate-900 mb-2">Horarios</h3>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 border-b border-slate-200">Día</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 border-b border-slate-200">Hora</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 border-b border-slate-200">Asignatura</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 border-b border-slate-200">Docente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horarios.map((h, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="px-3 py-2 text-slate-700">{DIAS[h.dia_semana - 1] || `Día ${h.dia_semana}`}</td>
                        <td className="px-3 py-2 text-slate-700">{h.hora_inicio?.slice(0, 5)} - {h.hora_fin?.slice(0, 5)}</td>
                        <td className="px-3 py-2 text-slate-700">{h.asignatura}</td>
                        <td className="px-3 py-2 text-slate-700">{h.docente || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {!isLoading && horarios.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No hay horarios registrados para este espacio.</p>
            )}
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
};

export const AcademicSpacesPages = () => {
  const [filtros, setFiltros] = useState({ tipo: '', estado: '', capacidad: '' });
  const [selected, setSelected] = useState(null);

  const { data: espacios = [], isLoading } = useQuery({
    queryKey: ['espacios', filtros],
    queryFn: () => obtenerEspacios(filtros)
  });
  const { data: tipos = [] } = useQuery({ queryKey: ['tipos-espacio'], queryFn: obtenerTiposEspacio });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Espacios Académicos</h1>
        <p className="text-sm text-slate-500 mt-1">
          Consulta disponibilidad de aulas, laboratorios, auditorios y salas de estudio
        </p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
          value={filtros.tipo} onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}>
          <option value="">Todos los tipos</option>
          {tipos.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
        </select>
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500"
          value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
          <option value="">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
        <Input type="number" placeholder="Capacidad mín." className="w-36"
          value={filtros.capacidad} onChange={(v) => setFiltros({ ...filtros, capacidad: v.target.value })} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {espacios.map((e) => (
            <Card key={e.id} className="cursor-pointer" onPress={() => setSelected(e)}>
              <CardHeader className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{e.nombre}</CardTitle>
                  <CardDescription>{e.codigo} &middot; {e.tipo_espacio}</CardDescription>
                </div>
                <Chip color={e.estado === 'disponible' ? 'success' : 'danger'} variant="soft" size="sm">
                  {e.estado === 'disponible' ? 'Disponible' : 'Mantenimiento'}
                </Chip>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-slate-600">
                  <span>📍 {e.edificio} P{e.piso}</span>
                  <span>👥 {e.capacidad}</span>
                </div>
              </CardContent>
              {(e.tiene_proyector || e.tiene_computadoras) && (
                <CardFooter className="flex gap-2">
                  {e.tiene_proyector && <Chip variant="flat" size="sm">Proyector</Chip>}
                  {e.tiene_computadoras && <Chip variant="flat" size="sm">Computadoras</Chip>}
                </CardFooter>
              )}
            </Card>
          ))}
          {espacios.length === 0 && (
            <p className="text-sm text-slate-400 col-span-full text-center py-8">No se encontraron espacios con esos filtros.</p>
          )}
        </div>
      )}

      {selected && <DetalleModal espacio={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
