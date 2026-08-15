import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Package, MapPin, CheckCircle2, Search } from 'lucide-react';

export default function Tracking() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get('order') || '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function find(e) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setOrder(null);
    const { data } = await supabase.rpc('get_order_tracking', {
      p_order_number: code.trim(),
      p_email: email.trim().toLowerCase()
    }).then(r => ({ data: r.data?.[0] || null }));
    
    setOrder(data);
    setLoading(false);
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'entregado': return 'text-green-600 bg-green-50';
      case 'en camino': return 'text-blue-600 bg-blue-50';
      case 'cancelado': return 'text-red-600 bg-red-50';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  return (
    <div className="container-page py-16 md:py-24 max-w-4xl">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Seguimiento de pedido</h1>
        <p className="text-neutral-500 text-lg">Ingresá tu número de pedido y el email con el que realizaste la compra para conocer su estado.</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] items-start">
        {/* Form */}
        <div className="bg-white p-8 border border-neutral-200">
          <form onSubmit={find} className="grid gap-6">
            <label className="grid gap-2 text-sm text-neutral-600 font-medium">
              Número de pedido
              <input 
                required 
                placeholder="Ej. GEN-12345" 
                value={code} 
                onChange={e => setCode(e.target.value)} 
                className="border border-neutral-300 p-4 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50"
              />
            </label>
            <label className="grid gap-2 text-sm text-neutral-600 font-medium">
              Correo electrónico
              <input 
                required 
                type="email" 
                placeholder="juan@ejemplo.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="border border-neutral-300 p-4 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50"
              />
            </label>
            <button 
              disabled={loading}
              className="w-full bg-neutral-900 py-4 text-white text-sm font-medium uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors flex justify-center items-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              {loading ? 'Buscando...' : 'Consultar pedido'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="flex flex-col h-full">
          {searched && !order && !loading && (
            <div className="h-full border border-dashed border-neutral-300 p-8 flex flex-col items-center justify-center text-center text-neutral-500 bg-stone-50">
              <Package size={48} strokeWidth={1} className="mb-4 text-neutral-300" />
              <p>No encontramos ningún pedido con esos datos.</p>
              <p className="text-sm mt-2">Por favor, verificá la información e intentá nuevamente.</p>
            </div>
          )}

          {order && (
            <div className="bg-stone-50 p-8 border border-neutral-200 h-full flex flex-col">
              <div className="flex justify-between items-start mb-8 pb-6 border-b border-neutral-200">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Orden confirmada</p>
                  <h3 className="text-2xl font-medium">{order.order_number}</h3>
                </div>
                <span className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full ${getStatusColor(order.status)}`}>
                  {order.status || 'Procesando'}
                </span>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="flex gap-4">
                  <div className="mt-1">
                    {order.payment_status?.toLowerCase() === 'approved' ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Pago</h4>
                    <p className="text-sm text-neutral-500 capitalize">{order.payment_status}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    {['shipped', 'delivered', 'entregado', 'en camino'].includes(order.shipping_status?.toLowerCase()) ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Envío</h4>
                    <p className="text-sm text-neutral-500 capitalize">{order.shipping_status || 'Pendiente'}</p>
                    
                    {order.tracking_code && (
                      <div className="mt-4 bg-white p-4 border border-neutral-200 rounded-sm">
                        <div className="flex items-center gap-2 text-sm font-medium mb-1">
                          <MapPin size={16} className="text-neutral-400" />
                          {order.carrier || 'Correo'}
                        </div>
                        <p className="text-neutral-600 font-mono text-sm tracking-wider">{order.tracking_code}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-between items-center">
                <span className="text-neutral-500">Total abonado</span>
                <span className="text-xl font-medium">${Number(order.total).toLocaleString('es-AR')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
