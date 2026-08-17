import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../context';
import { track } from '../lib/analytics';

export default function ProductCard({ p }) {
  const { add } = useStore();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    add(p);
    track('add_to_cart', { item_id: p.id, item_name: p.name, value: p.price });
  };

  return (
    <article className="group relative flex flex-col">
      <Link 
        to={`/producto/${p.slug || p.id}`} 
        onClick={() => track('select_item', { item_id: p.id, item_name: p.name })}
        className="block w-full overflow-hidden bg-stone-100 aspect-[3/4] relative mb-4"
      >
        {p.image_url ? (
          <img 
            src={p.image_url} 
            alt={p.name} 
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
        ) : (
          <div className="grid h-full place-items-center text-sm tracking-wide text-neutral-400">
            Sin imagen
          </div>
        )}
        
        {/* Quick Add Button on Hover (Desktop) */}
        <button 
          onClick={handleAdd}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] bg-white/90 backdrop-blur-md text-neutral-900 font-medium py-3 text-xs tracking-wider uppercase opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hidden md:flex items-center justify-center gap-2 hover:bg-neutral-900 hover:text-white"
        >
          Agregar
        </button>
      </Link>
      
      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-start gap-2">
          <Link 
            to={`/producto/${p.slug || p.id}`}
            className="font-medium text-neutral-900 leading-snug hover:text-neutral-500 transition-colors line-clamp-1"
          >
            {p.name}
          </Link>
          <span className="font-semibold text-neutral-900 text-sm whitespace-nowrap">
            ${Number(p.price).toLocaleString('es-AR')}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-neutral-500 tracking-wide uppercase">
            {p.category}
          </p>
          {/* Quick Add Button (Mobile) */}
          <button 
            onClick={handleAdd}
            className="md:hidden text-neutral-400 hover:text-neutral-900 transition-colors p-2 -mr-2"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
