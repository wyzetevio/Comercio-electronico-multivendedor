import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { actualizarTienda } from '../../services/tiendaService';
import Boton from '../../components/ui/Boton';
import Input from '../../components/ui/Input';
import Alerta from '../../components/ui/Alerta';
import { Store, Save, MapPin, AlignLeft } from 'lucide-react';

function PerfilTienda() {
  const { tienda, actualizarTiendaLocal } = useStore();

  const [formData, setFormData] = useState({
    nombreTienda: '',
    descripcion: '',
    direccion: '',
    logo: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (tienda) {
      setFormData({
        nombreTienda: tienda.nombreTienda || '',
        descripcion: tienda.descripcion || '',
        direccion: tienda.direccion || '',
        logo: tienda.logo || ''
      });
    }
  }, [tienda]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!formData.nombreTienda || !formData.descripcion) {
      setError('El nombre y la descripción son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const actualizada = await actualizarTienda(tienda.idTienda, {
        ...tienda,
        nombreTienda: formData.nombreTienda,
        descripcion: formData.descripcion,
        direccion: formData.direccion,
        logo: formData.logo
      });

      actualizarTiendaLocal(actualizada);
      setSuccess('¡Perfil de tienda actualizado correctamente!');
    } catch (err) {
      setError('Ocurrió un error al actualizar la tienda.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!tienda) {
    return <div className="p-8 text-center text-gray-500">Cargando datos de la tienda...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Perfil de Tienda</h1>
        <p className="text-gray-500 mt-1">Gestiona la información pública de tu negocio.</p>
      </div>

      {success && <div className="mb-6"><Alerta message={success} type="success" /></div>}
      {error && <div className="mb-6"><Alerta message={error} type="error" /></div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Foto de Perfil / Logo Vista Previa */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
              <div className="w-24 h-24 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-200 flex items-center justify-center overflow-hidden shadow-inner">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo tienda" className="w-full h-full object-cover" />
                ) : (
                  <Store size={36} className="text-amber-400" />
                )}
              </div>
              <div className="flex-1 w-full space-y-1">
                <label className="block text-sm font-semibold text-gray-700">Foto de Perfil / Logo (Enlace)</label>
                <Input
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                />
                <p className="text-xs text-gray-400">Pega la URL de una imagen en internet para usarla como foto de tu negocio.</p>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <Store size={18} className="text-amber-500" />
                Nombre de la Tienda *
              </label>
              <Input
                name="nombreTienda"
                value={formData.nombreTienda}
                onChange={handleChange}
                placeholder="Ej. Evans Music"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <AlignLeft size={18} className="text-amber-500" />
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
                placeholder="Describe tu tienda..."
              />
              <p className="text-xs text-gray-400 mt-1">Esta descripción es visible para todos tus clientes.</p>
            </div>

            {/* Dirección */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <MapPin size={18} className="text-amber-500" />
                Dirección Física (Opcional)
              </label>
              <Input
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej. Av. Principal 123"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Boton type="submit" disabled={loading} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700">
                <Save size={18} />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Boton>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default PerfilTienda;
