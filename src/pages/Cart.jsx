import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context';

export default function Cart() {
  const { cart, remove, update, subtotal } = useStore();
  const nav = useNavigate();

  if (!cart.length) {
    return (
      <div className="container-page py-32 flex flex-col items-center justify-center text-center">
        <ShoppingBag size={64} strokeWidth={1} className="text-neutral-300 mb-6" />
        <h1 className="text-3xl font-medium tracking-tight mb-4">Tu carrito está vacío</h1>
        <p className="text-neutral-500 max-w-md mx-auto mb-8">
          Parece que aún no has agregado productos a tu carrito. Descubrí nuestra última colección.
        </p>
        <Link 
          to="/catalogo" 
          className="bg-neutral-900 text-white px-8 py-4 text-sm font-medium tracking-wide uppercase hover:bg-neutral-800 transition-colors"
        >
          Explorar tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-12">Carrito</h1>
      
      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        {/* Cart Items */}
        <div className="flex flex-col gap-8">
          {cart.map(i => (
            <div className="flex gap-6 group border-b border-neutral-200 pb-8" key={i.key}>
              <Link to={`/producto/${i.product.slug || i.product.id}`} className="h-40 w-32 bg-stone-100 overflow-hidden relative flex-shrink-0">
                {i.product.image_url && <img src={i.product.image_url} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
              </Link>
              
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link to={`/producto/${i.product.slug || i.product.id}`} className="text-lg font-medium hover:underline underline-offset-4 line-clamp-2 leading-snug">
                      {i.product.name}
                    </Link>
                    <p className="text-sm text-neutral-500 mt-2 capitalize">
                      {i.variant?.size} {i.variant?.color ? `· ${i.variant.color}` : ''}
                    </p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">${Number(i.product.price).toLocaleString('es-AR')}</p>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center border border-neutral-300 rounded-sm">
                    <button className="px-3 py-1.5 text-neutral-500 hover:bg-neutral-100 transition-colors" onClick={() => update(i.key, i.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span className="px-3 text-sm font-medium min-w-[2.5rem] text-center">{i.quantity}</span>
                    <button className="px-3 py-1.5 text-neutral-500 hover:bg-neutral-100 transition-colors" onClick={() => update(i.key, i.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <button onClick={() => remove(i.key)} className="text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-medium">
                    <Trash2 size={18} strokeWidth={1.5} />
                    <span className="hidden sm:inline">Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="h-fit bg-stone-50 p-8 border border-neutral-200">
          <h2 className="text-xl font-medium tracking-tight mb-6">Resumen de orden</h2>
          
          <div className="space-y-4 text-sm text-neutral-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="text-neutral-400 italic">Calculado en el checkout</span>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 pt-6 mb-8 flex justify-between items-end">
            <span className="text-base font-medium">Total</span>
            <span className="text-2xl font-semibold text-neutral-900">${subtotal.toLocaleString('es-AR')}</span>
          </div>
          
          <button 
            onClick={() => nav('/checkout')} 
            className="w-full bg-neutral-900 text-white py-4 text-sm font-medium tracking-wide uppercase hover:bg-neutral-800 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-neutral-900/10"
          >
            Continuar compra <ArrowRight size={18} />
          </button>
        </aside>
      </div>
    </div>
  );
}
