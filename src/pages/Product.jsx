import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../context';
import { track } from '../lib/analytics';
import { Loader2, ShieldCheck, Truck, ChevronRight } from 'lucide-react';

export default function Product() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const { add } = useStore();
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    setLoading(true);
    supabase.from('products').select('*').or(`slug.eq.${slug},id.eq.${slug}`).single()
      .then(({ data, error }) => {
        if (error) setErrorText('No se pudo encontrar el producto.');
        setP(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page py-32 flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm font-medium tracking-widest uppercase">Cargando producto...</p>
      </div>
    );
  }

  if (!p || errorText) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="text-2xl font-medium mb-4">{errorText || 'Producto no encontrado'}</h1>
        <Link to="/catalogo" className="underline underline-offset-4 hover:text-neutral-500">Volver a la tienda</Link>
      </div>
    );
  }

  const sizes = p.sizes || [];
  const colors = p.colors || [];

  const isAddDisabled = p.stock < 1 || (sizes.length > 0 && !size) || (colors.length > 0 && !color);

  return (
    <div className="container-page py-12 lg:py-20">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-8 tracking-wide uppercase">
        <Link to="/" className="hover:text-neutral-900">Inicio</Link>
        <ChevronRight size={12} />
        <Link to="/catalogo" className="hover:text-neutral-900">Colección</Link>
        <ChevronRight size={12} />
        <Link to={`/catalogo?category=${encodeURIComponent(p.category)}`} className="hover:text-neutral-900">{p.category}</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-900 line-clamp-1">{p.name}</span>
      </nav>

      <div className="grid gap-12 lg:gap-20 lg:grid-cols-[1.2fr_1fr]">
        
        {/* Product Image (Sticky on Desktop) */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="aspect-[3/4] md:aspect-[4/5] bg-stone-100 w-full relative overflow-hidden">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-neutral-400">Sin imagen</div>
            )}
            {p.stock < 1 && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-neutral-900 px-3 py-1 text-xs font-medium uppercase tracking-widest shadow-sm">
                Agotado
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="py-2 lg:py-4 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">{p.name}</h1>
          <p className="text-2xl font-semibold mb-8">${Number(p.price).toLocaleString('es-AR')}</p>
          
          <div className="prose prose-sm text-neutral-600 mb-10 leading-relaxed">
            <p>{p.description || 'Una prenda diseñada con estándares premium y estética contemporánea, pensada para elevar tu estilo diario.'}</p>
          </div>

          <div className="h-px w-full bg-neutral-200 mb-10"></div>

          {/* Variants */}
          <div className="space-y-8 mb-10">
            {colors.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium tracking-wide uppercase">Color</p>
                  <span className="text-xs text-neutral-500">{color || 'Seleccionar'}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map(x => (
                    <button 
                      key={x} 
                      onClick={() => setColor(x)} 
                      className={`h-10 px-5 text-sm font-medium transition-all ${color === x ? 'bg-neutral-900 text-white shadow-md' : 'bg-stone-100 text-neutral-600 hover:bg-stone-200'}`}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium tracking-wide uppercase">Talle</p>
                  <button className="text-xs text-neutral-500 underline underline-offset-4 hover:text-neutral-900">Guía de talles</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(x => (
                    <button 
                      key={x} 
                      onClick={() => setSize(x)} 
                      className={`h-10 min-w-[3rem] px-4 text-sm font-medium transition-all ${size === x ? 'bg-neutral-900 text-white shadow-md' : 'bg-stone-100 text-neutral-600 hover:bg-stone-200'}`}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <button 
            disabled={isAddDisabled} 
            onClick={() => {
              add(p, { size, color });
              track('add_to_cart', { item_id: p.id, item_name: p.name, value: p.price });
            }} 
            className="w-full bg-neutral-900 py-4 text-sm font-medium tracking-wide uppercase text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/20"
          >
            {p.stock > 0 ? (isAddDisabled && (sizes.length || colors.length) ? 'Seleccioná una variante' : 'Agregar al carrito') : 'Sin stock'}
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-neutral-500 tracking-wide">
            {p.stock > 0 ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Stock disponible: {p.stock} unidades
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Sin stock
              </>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-neutral-200 grid gap-6">
            <div className="flex items-start gap-4">
              <Truck className="text-neutral-400 shrink-0" size={24} strokeWidth={1.5} />
              <div>
                <h4 className="text-sm font-semibold mb-1">Envíos a todo el país</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">Calculá el costo y fecha de entrega en el siguiente paso.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="text-neutral-400 shrink-0" size={24} strokeWidth={1.5} />
              <div>
                <h4 className="text-sm font-semibold mb-1">Compra Protegida</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">Tus datos seguros. Procesamos tu pago a través de Mercado Pago.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
