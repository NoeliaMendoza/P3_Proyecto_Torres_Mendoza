import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input,
  Modal, ModalDialog, ModalHeader, ModalHeading, ModalBody, ModalCloseTrigger,
  Button, Chip, Spinner
} from '@heroui/react';
import { toast } from 'sonner';
import { obtenerEspacios, obtenerTiposEspacio, crearEspacio, actualizarEspacio, cambiarEstadoEspacio } from '../../services/espacios.services';

const FormularioEspacio = ({ espacio, tipos, onClose }) => {
  const [form, setForm] = useState({
    codigo: espacio?.codigo || '',
    nombre: espacio?.nombre || '',
    id_tipo: espacio?.id_tipo?.toString() || '',
    edificio: espacio?.edificio || '',
    piso: espacio?.piso?.toString() || '',
    capacidad: espacio?.capacidad?.toString() || '',
    tiene_proyector: espacio?.tiene_proyector || false,
    tiene_computadoras: espacio?.tiene_computadoras || false,
  });
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const esEdicion = !!espacio;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        id_tipo: parseInt(form.id_tipo),
        piso: form.piso ? parseInt(form.piso) : null,
        capacidad: form.capacidad ? parseInt(form.capacidad) : null,
        tiene_proyector: form.tiene_proyector === true || form.tiene_proyector === 'true',
        tiene_computadoras: form.tiene_computadoras === true || form.tiene_computadoras === 'true',
      };
      if (esEdicion) {
        await actualizarEspacio(espacio.id, data);
        toast.success('Espacio actualizado');
      } else {
        await crearEspacio(data);
        toast.success('Espacio creado correctamente');
      }
      queryClient.invalidateQueries({ queryKey: ['espacios'] });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Código *</label>
          <Input type="text" required value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
          <Input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
            value={form.id_tipo} onChange={(e) => setForm({ ...form, id_tipo: e.target.value })} required>
            <option value="">Seleccionar tipo</option>
            {tipos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Edificio</label>
          <Input type="text" value={form.edificio} onChange={(e) => setForm({ ...form, edificio: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Piso</label>
          <Input type="number" value={form.piso} onChange={(e) => setForm({ ...form, piso: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Capacidad</label>
          <Input type="number" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })} />
        </div>
        <div className="flex items-end gap-4 pb-1">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.tiene_proyector === true || form.tiene_proyector === 'true'}
              onChange={(e) => setForm({ ...form, tiene_proyector: e.target.checked })} />
            Proyector
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.tiene_computadoras === true || form.tiene_computadoras === 'true'}
              onChange={(e) => setForm({ ...form, tiene_computadoras: e.target.checked })} />
            Computadoras
          </label>
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" onPress={onClose} type="button">Cancelar</Button>
        <Button type="submit" isDisabled={loading}>{loading ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear espacio'}</Button>
      </div>
    </form>
  );
};

export const AdminSpacesPages = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();

  const { data: espacios = [], isLoading } = useQuery({ queryKey: ['espacios', 'admin'], queryFn: () => obtenerEspacios() });
  const { data: tipos = [] } = useQuery({ queryKey: ['tipos-espacio'], queryFn: obtenerTiposEspacio });

  const cambiarEstadoMut = useMutation({
    mutationFn: ({ id, estado }) => cambiarEstadoEspacio(id, estado),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['espacios'] }); toast.success('Estado actualizado'); },
    onError: (err) => toast.error(err.response?.data?.mensaje || 'Error al cambiar estado'),
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administrar Espacios</h1>
          <p className="text-sm text-slate-500 mt-1">Crea, edita o cambia el estado de los espacios académicos</p>
        </div>
        <Button onPress={() => { setEditing(null); setModalOpen(true); }}>+ Nuevo espacio</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {espacios.map((e) => (
            <Card key={e.id}>
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
                {(e.tiene_proyector || e.tiene_computadoras) && (
                  <div className="flex gap-2 mt-2">
                    {e.tiene_proyector && <Chip variant="flat" size="sm">Proyector</Chip>}
                    {e.tiene_computadoras && <Chip variant="flat" size="sm">Computadoras</Chip>}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2 flex-wrap">
                <select className="border border-slate-300 rounded-lg px-2 py-1 text-xs bg-white"
                  value={e.estado} onChange={(v) => cambiarEstadoMut.mutate({ id: e.id, estado: v.target.value })}>
                  <option value="disponible">Disponible</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
                <Button size="sm" variant="ghost" onPress={() => { setEditing(e); setModalOpen(true); }}>
                  Editar
                </Button>
              </CardFooter>
            </Card>
          ))}
          {espacios.length === 0 && (
            <p className="text-sm text-slate-400 col-span-full text-center py-8">No hay espacios registrados.</p>
          )}
        </div>
      )}

      <Modal state={{ isOpen: modalOpen, setOpen: setModalOpen }}>
        <Modal.Backdrop />
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>{editing ? 'Editar espacio' : 'Nuevo espacio'}</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              {modalOpen && <FormularioEspacio espacio={editing} tipos={tipos} onClose={() => { setModalOpen(false); setEditing(null); }} />}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </div>
  );
};