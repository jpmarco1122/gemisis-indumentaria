import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

export default function Catalog() {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([]);
  
  const currentCategory = params.get('category');
  const currentSearch = params.get('search');

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false });
      
      if (currentCategory) q = q.eq('category', currentCategory);
      if (currentSearch) q = q.ilike('name', `%${currentSearch}%`);
      
      const { data } = await q;
      setProducts(data || []);
      
      const { data: cd } = await supabase.from('categories').select('*').order('name');
      setCats(cd || []);
      
      setLoading(false);
    })();
  }, [params]);

  return (
    <div className="container-page py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-neutral-200 pb-8 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
            {currentSearch ? `Resultados para "${currentSearch}"` : currentCategory ? currentCategory : 'Colección Completa'}
          </h1>
          <p className="mt-3 text-neutral-500 max-w-xl">
            {currentSearch ? 'Encontramos estos productos basados en tu búsqueda.' : 'Explorá nuestras prendas diseñadas con enfoque en cortes limpios y materiales de calidad.'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm">
          {['Todos', ...cats.map(c => c.name)].map(c => {
            const isActive = c === 'Todos' ? !currentCategory && !currentSearch : currentCategory === c;
            const to = c === 'Todos' ? '/catalogo' : `/catalogo?category=${encodeURIComponent(c)}`;
            return (
              <Link 
                key={c} 
                to={to}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 font-medium transition-colors ${isActive ? 'bg-neutral-900 text-white' : 'bg-stone-100 text-neutral-600 hover:bg-stone-200'}`}
              >
                {c}
              </Link>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-neutral-400">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="text-sm font-medium tracking-widest uppercase">Cargando colección...</p>
        </div>
      ) : products.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-12">
          {products.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center text-neutral-500">
          <p className="text-lg">No encontramos productos en esta categoría.</p>
          <Link to="/catalogo" className="mt-6 inline-block underline underline-offset-4 hover:text-neutral-900 transition-colors">Ver todos los productos</Link>
        </div>
      )}
    </div>
  );
}
