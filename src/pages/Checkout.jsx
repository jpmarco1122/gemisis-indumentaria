import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context';
import { track } from '../lib/analytics';
import { ShieldCheck, ArrowLeft, Loader2, CreditCard } from 'lucide-react';

export default function Checkout() {
  const { cart, subtotal } = useStore();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', postal_code: '' });
  const [loading, setLoading] = useState(false);

  async function pay(e) {
    e.preventDefault();
    if (!cart.length) return;
    setLoading(true);
    try {
      const r = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: cart.map(i => ({
            product_id: i.product.id,
            title: i.product.name,
            quantity: i.quantity,
            unit_price: Number(i.product.price),
            variant: i.variant
          }))
        })
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'No se pudo iniciar el pago');
      track('begin_checkout', { value: subtotal, currency: 'ARS' });
      window.location.href = d.init_point;
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  }

  if (!cart.length) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="text-3xl font-medium tracking-tight mb-4">No hay productos</h1>
        <p className="text-neutral-500 mb-8">Agregá productos al carrito para proceder al pago.</p>
        <Link to="/catalogo" className="bg-neutral-900 text-white px-8 py-4 text-sm font-medium uppercase hover:bg-neutral-800 transition-colors">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12 lg:py-20">
      <Link to="/carrito" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8">
        <ArrowLeft size={16} /> Volver al carrito
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-10">Finalizar compra</h1>
      
      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <div>
          <form onSubmit={pay} className="grid gap-6">
            
            <div className="bg-white p-6 md:p-8 border border-neutral-200">
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2"><UserIcon /> Datos de contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="grid gap-2 text-sm text-neutral-600">
                  Nombre completo
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50" placeholder="Ej. Juan Pérez" />
                </label>
                <label className="grid gap-2 text-sm text-neutral-600">
                  Email
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50" placeholder="juan@ejemplo.com" />
                </label>
                <label className="grid gap-2 text-sm text-neutral-600 md:col-span-2">
                  Teléfono
                  <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50" placeholder="+54 11 1234 5678" />
                </label>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 border border-neutral-200">
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2"><MapIcon /> Dirección de envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="grid gap-2 text-sm text-neutral-600 md:col-span-2">
                  Dirección
                  <input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50" placeholder="Calle y número" />
                </label>
                <label className="grid gap-2 text-sm text-neutral-600">
                  Ciudad
                  <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50" placeholder="Ciudad o localidad" />
                </label>
                <label className="grid gap-2 text-sm text-neutral-600">
                  Código Postal
                  <input required value={form.postal_code} onChange={e => setForm({...form, postal_code: e.target.value})} className="border border-neutral-300 p-3 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50" placeholder="Ej. 1414" />
                </label>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-neutral-900 py-4 text-white text-sm font-medium uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors flex justify-center items-center gap-3 mt-4">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
              {loading ? 'Procesando...' : 'Ir a pagar con Mercado Pago'}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 mt-2">
              <ShieldCheck size={14} className="text-green-600" /> Transacción 100% segura
            </div>
          </form>
        </div>

        {/* Summary */}
        <aside className="h-fit bg-stone-50 p-6 md:p-8 border border-neutral-200">
          <h2 className="text-lg font-medium mb-6">Tu pedido</h2>
          
          <div className="grid gap-4 mb-6">
            {cart.map(i => (
              <div key={i.key} className="flex gap-4">
                <div className="h-20 w-16 bg-stone-200 flex-shrink-0">
                  {i.product.image_url && <img src={i.product.image_url} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-sm font-medium line-clamp-1">{i.product.name}</p>
                  <p className="text-xs text-neutral-500 mt-1 capitalize">{i.variant?.size} {i.variant?.color ? `· ${i.variant.color}` : ''}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-neutral-500">Cant: {i.quantity}</span>
                    <span className="text-sm font-medium">${(i.product.price * i.quantity).toLocaleString('es-AR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-neutral-200 pt-6 space-y-3 text-sm text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="text-neutral-900 font-medium">A calcular</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between border-t border-neutral-900 pt-6">
            <span className="font-medium text-lg">Total</span>
            <span className="font-bold text-2xl text-neutral-900">${subtotal.toLocaleString('es-AR')}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function UserIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function MapIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
