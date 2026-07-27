import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Button, Input, TextArea,
  Modal, ModalDialog, ModalHeader, ModalHeading, ModalBody, ModalCloseTrigger,
  Chip, Spinner
} from '@heroui/react';
import { toast } from 'sonner';
import { useAuthStore } from '../../store';
import { obtenerObjetos, crearObjeto, actualizarObjeto, eliminarObjeto, reclamarObjeto, moderarObjeto, obtenerCategorias } from '../../services/objetos.services';

const FormularioObjeto = ({ objeto, categorias, onClose }) => {
  const [form, setForm] = useState({
    titulo: objeto?.titulo || '',
    descripcion: objeto?.descripcion || '',
    tipo: objeto?.tipo || 'perdido',
    id_categoria: objeto?.id_categoria?.toString() || '',
    ubicacion: objeto?.ubicacion || '',
    informacion_contacto: objeto?.informacion_contacto || '',
  });
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const esEdicion = !!objeto;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        id_categoria: form.id_categoria ? parseInt(form.id_categoria) : undefined,
      };
      if (esEdicion) {
        await actualizarObjeto(objeto.id, data);
        toast.success('Reporte actualizado');
      } else {
        await crearObjeto(data);
        toast.success('Reporte creado correctamente');
      }
      queryClient.invalidateQueries({ queryKey: ['objetos'] });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
        <Input type="text" required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
        <TextArea required value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
            value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            <option value="perdido">Perdido</option>
            <option value="encontrado">Encontrado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
            value={form.id_categoria} onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}>
            <option value="">Sin categoría</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
        <Input type="text" value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} placeholder="Edificio, piso, aula..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Información de contacto</label>
        <Input type="text" value={form.informacion_contacto} onChange={(e) => setForm({ ...form, informacion_contacto: e.target.value })} placeholder="Teléfono, email..." />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" onPress={onClose} type="button">Cancelar</Button>
        <Button type="submit" isDisabled={loading}>{loading ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Publicar'}</Button>
      </div>
    </form>
  );
};

export const LostObjectsPages = () => {
  const [tab, setTab] = useState('todos');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();
  const usuario = useAuthStore((s) => s.usuario);

  const tipoMap = { todos: '', perdido: 'perdido', encontrado: 'encontrado' };
  const { data: objetos = [], isLoading } = useQuery({
    queryKey: ['objetos', tab, search, catFilter],
    queryFn: () => obtenerObjetos({ tipo: tipoMap[tab], search: search || undefined, categoria: catFilter || undefined }),
  });
  const { data: categorias = [] } = useQuery({ queryKey: ['categorias'], queryFn: obtenerCategorias });

  const eliminarMut = useMutation({
    mutationFn: eliminarObjeto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['objetos'] }); toast.success('Reporte eliminado'); },
    onError: (err) => toast.error(err.response?.data?.mensaje || 'Error al eliminar'),
  });

  const moderarMut = useMutation({
    mutationFn: moderarObjeto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['objetos'] }); toast.success('Reporte moderado por administrador'); },
    onError: (err) => toast.error(err.response?.data?.mensaje || 'Error al moderar'),
  });

  const reclamarMut = useMutation({
    mutationFn: reclamarObjeto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['objetos'] }); toast.success('Objeto reclamado correctamente'); },
    onError: (err) => toast.error(err.response?.data?.mensaje || 'Error al reclamar'),
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Objetos Perdidos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Publica objetos encontrados o reporta objetos perdidos en el campus
          </p>
        </div>
        <Button onPress={() => { setEditing(null); setModalOpen(true); }}>+ Nuevo reporte</Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-1 mb-4">
          {['todos', 'perdido', 'encontrado'].map((t) => (
            <button key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {t === 'todos' ? 'Todos' : t === 'perdido' ? 'Perdidos' : 'Encontrados'}
            </button>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap">
          <Input type="text" placeholder="Buscar por título o descripción..."
            value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
            value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {objetos.map((o) => {
            const esMio = usuario?.nombre === o.reportante_nombre;
            const esAdmin = usuario?.rol === 'admin';
            return (
              <Card key={o.id}>
                <CardHeader className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{o.titulo}</CardTitle>
                    <CardDescription className="text-xs">{o.categoria_nombre || 'Sin categoría'}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Chip color={o.tipo === 'perdido' ? 'danger' : 'warning'} variant="soft" size="sm">
                      {o.tipo === 'perdido' ? 'Perdido' : 'Encontrado'}
                    </Chip>
                    {o.estado !== 'abierto' && (
                      <Chip color={o.estado === 'resuelto' ? 'success' : 'default'} variant="soft" size="sm">
                        {o.estado}
                      </Chip>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-3">{o.descripcion}</p>
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    {o.ubicacion && <div>📍 {o.ubicacion}</div>}
                    <div>📅 {o.fecha_reporte ? new Date(o.fecha_reporte).toLocaleDateString() : '—'}</div>
                    <div>👤 {o.reportante_nombre}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 flex-wrap">
                  {!esMio && o.tipo === 'encontrado' && o.estado === 'abierto' && (
                    <Button size="sm" variant="solid" onPress={() => reclamarMut.mutate(o.id)}>
                      Reclamar
                    </Button>
                  )}
                  {(esMio || esAdmin) && (
                    <>
                      {esMio && (
                        <Button size="sm" variant="ghost" onPress={() => { setEditing(o); setModalOpen(true); }}>
                          Editar
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" color="danger"
                        onPress={() => {
                          if (confirm('¿Eliminar este reporte?')) {
                            esMio ? eliminarMut.mutate(o.id) : moderarMut.mutate(o.id);
                          }
                        }}>
                        {esMio ? 'Eliminar' : '🗑️ Moderar'}
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            );
          })}
          {objetos.length === 0 && (
            <p className="text-sm text-slate-400 col-span-full text-center py-8">No se encontraron objetos.</p>
          )}
        </div>
      )}

      <Modal state={{ isOpen: modalOpen, setOpen: setModalOpen }}>
        <Modal.Backdrop />
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>{editing ? 'Editar reporte' : 'Nuevo reporte'}</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              {modalOpen && <FormularioObjeto objeto={editing} categorias={categorias} onClose={() => { setModalOpen(false); setEditing(null); }} />}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </div>
  );
};
