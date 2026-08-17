import { useEffect, useState } from 'react';
import { supabase, STORAGE_BUCKET } from '../lib/supabase';
import { useStore } from '../context';
import { LogOut, Plus, Package, ShoppingBag, Loader2 } from 'lucide-react';

export default function Admin() {
  const { session } = useStore();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'Mujer',
    price: '',
    stock: '',
    description: '',
    sizes: '',
    colors: ''
  });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [{ data: p }, { data: o }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(30)
    ]);
    setProducts(p || []);
    setOrders(o || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (!session) {
    return (
      <div className="container-page py-32 text-center text-neutral-500">
        No autorizado. Ingresá desde /login.
      </div>
    );
  }

  async function create(e) {
    e.preventDefault();
    setMsg('');
    setIsSaving(true);

    let image_url = null;
    if (file) {
      const ext = file.name.split('.').pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: false });
      if (up.error) {
        setMsg(`Error subiendo imagen: ${up.error.message}`);
        setIsSaving(false);
        return;
      }
      image_url = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      sizes: form.sizes ? form.sizes.split(',').map(x => x.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(',').map(x => x.trim()).filter(Boolean) : [],
      image_url
    };

    const { error } = await supabase.from('products').insert(payload);
    
    if (error) {
      setMsg(error.message);
    } else {
      setMsg('Producto creado exitosamente');
      setForm({
        name: '', slug: '', category: 'Mujer', price: '', stock: '', description: '', sizes: '', colors: ''
      });
      setFile(null);
      load();
    }
    setIsSaving(false);
  }

  async function updateOrder(id, patch) {
    await supabase.from('orders').update(patch).eq('id', id);
    load();
  }

  return (
    <div className="container-page py-12 md:py-20 bg-stone-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-neutral-500 uppercase mb-2">Backoffice</p>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight">Panel de Control</h1>
        </div>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>

      <div className="grid gap-12 lg:grid-cols-[380px_1fr] items-start">
        
        {/* Form Column */}
        <div className="bg-white p-8 border border-neutral-200 sticky top-28 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-200">
            <Plus size={20} className="text-neutral-400" />
            <h2 className="text-xl font-medium tracking-tight">Nuevo producto</h2>
          </div>

          <form onSubmit={create} className="grid gap-5">
            <label className="grid gap-2 text-sm text-neutral-600 font-medium">
              Nombre
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50 font-normal" />
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-2 text-sm text-neutral-600 font-medium">
                Slug
                <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50 font-normal" placeholder="ej-remera" />
              </label>
              <label className="grid gap-2 text-sm text-neutral-600 font-medium">
                Categoría
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50 font-normal">
                  <option>Mujer</option>
                  <option>Hombre</option>
                  <option>Accesorios</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-2 text-sm text-neutral-600 font-medium">
                Precio
                <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50 font-normal" />
              </label>
              <label className="grid gap-2 text-sm text-neutral-600 font-medium">
                Stock
                <input required type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50 font-normal" />
              </label>
            </div>

            <label className="grid gap-2 text-sm text-neutral-600 font-medium">
              Descripción
              <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50 font-normal resize-none" />
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-2 text-sm text-neutral-600 font-medium">
                Talles
                <input placeholder="S, M, L" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50 font-normal text-xs" />
              </label>
              <label className="grid gap-2 text-sm text-neutral-600 font-medium">
                Colores
                <input placeholder="Negro, Blanco" value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50 font-normal text-xs" />
              </label>
            </div>

            <label className="grid gap-2 text-sm text-neutral-600 font-medium">
              Imagen
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="border border-neutral-300 p-2 outline-none focus:border-neutral-900 bg-stone-50 font-normal text-xs file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-medium file:bg-neutral-200 file:text-neutral-700 hover:file:bg-neutral-300 cursor-pointer" />
            </label>

            <button disabled={isSaving} className="w-full bg-neutral-900 py-4 text-white text-sm font-medium tracking-wide uppercase disabled:opacity-70 flex justify-center items-center gap-2 hover:bg-neutral-800 transition-colors mt-2 shadow-md">
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : null}
              {isSaving ? 'Guardando...' : 'Publicar producto'}
            </button>
            
            {msg && (
              <div className={`p-4 text-sm font-medium text-center border mt-2 ${msg.includes('Error') ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                {msg}
              </div>
            )}
          </form>
        </div>

        {/* Data Column */}
        <div className="flex flex-col gap-12">
          
          {/* Orders Table */}
          <div className="bg-white p-8 border border-neutral-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200">
              <Package size={20} className="text-neutral-400" />
              <h2 className="text-xl font-medium tracking-tight">Últimos pedidos</h2>
            </div>
            
            {loading ? (
              <div className="py-12 flex justify-center text-neutral-400"><Loader2 className="animate-spin" size={24} /></div>
            ) : orders.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 font-medium tracking-wide uppercase text-xs">
                      <th className="pb-4 pr-4">Pedido</th>
                      <th className="pb-4 pr-4">Cliente</th>
                      <th className="pb-4 pr-4">Pago</th>
                      <th className="pb-4 pr-4">Estado</th>
                      <th className="pb-4">Tracking Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-4 pr-4 font-medium text-neutral-900">{o.order_number}</td>
                        <td className="py-4 pr-4 text-neutral-600">{o.customer_email}</td>
                        <td className="py-4 pr-4">
                          <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${o.payment_status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                            {o.payment_status}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <select
                            value={o.status}
                            onChange={e => updateOrder(o.id, { status: e.target.value })}
                            className="border border-neutral-300 p-1.5 text-xs outline-none focus:border-neutral-900 bg-white cursor-pointer"
                          >
                            <option>PENDING</option>
                            <option>PAID</option>
                            <option>PREPARING</option>
                            <option>SHIPPED</option>
                            <option>DELIVERED</option>
                            <option>CANCELLED</option>
                          </select>
                        </td>
                        <td className="py-4">
                          <input
                            defaultValue={o.tracking_code || ''}
                            onBlur={e => updateOrder(o.id, { tracking_code: e.target.value })}
                            placeholder="Añadir código"
                            className="w-full max-w-[140px] border border-neutral-300 p-1.5 text-xs outline-none focus:border-neutral-900 bg-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500 text-sm">No hay pedidos recientes.</div>
            )}
          </div>

          {/* Products Grid */}
          <div className="bg-white p-8 border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200">
              <ShoppingBag size={20} className="text-neutral-400" />
              <h2 className="text-xl font-medium tracking-tight">Catálogo activo ({products.length})</h2>
            </div>
            
            {loading ? (
              <div className="py-12 flex justify-center text-neutral-400"><Loader2 className="animate-spin" size={24} /></div>
            ) : products.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => (
                  <div key={p.id} className="group relative border border-neutral-200 overflow-hidden bg-white">
                    <div className="aspect-[3/4] bg-stone-100 relative overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="grid h-full place-items-center text-xs text-neutral-400">Sin img</div>
                      )}
                      {!p.active && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center text-sm font-medium uppercase tracking-wider text-neutral-900">
                          Inactivo
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1 line-clamp-1">{p.category}</p>
                      <h3 className="font-medium text-sm line-clamp-1 text-neutral-900 leading-snug mb-2">{p.name}</h3>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="font-semibold text-sm">${Number(p.price).toLocaleString('es-AR')}</span>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500 text-sm">No hay productos en el catálogo.</div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}


