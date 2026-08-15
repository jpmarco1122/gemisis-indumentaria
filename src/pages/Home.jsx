import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Clock } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full bg-stone-200 overflow-hidden flex items-center">
        {/* Background Image with subtle overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=85" 
            alt="Colección Genesis" 
            className="h-full w-full object-cover object-center scale-105 animate-[slowZoom_20s_ease-out_forwards]"
          />
          <div className="absolute inset-0 bg-neutral-900/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container-page relative z-10 flex flex-col justify-end h-full pb-20 md:pb-32">
          <div className="max-w-2xl text-white">
            <p className="text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-4 opacity-90">
              Nueva Temporada
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Estilo que<br />habla por vos.
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-lg font-light leading-relaxed">
              Diseño minimalista y contemporáneo para quienes buscan elegancia en lo simple. Descubrí nuestra última colección.
            </p>
            <Link 
              to="/catalogo" 
              className="inline-flex items-center gap-3 bg-white text-neutral-900 px-8 py-4 text-sm font-medium tracking-wide uppercase hover:bg-neutral-200 transition-colors"
            >
              Ver colección <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-stone-50">
        <div className="container-page">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-medium tracking-tight">Selección</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/catalogo?category=Mujer" className="group relative h-[500px] overflow-hidden bg-stone-200">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85" alt="Mujer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white text-3xl font-medium tracking-wide">Mujer</h3>
                <span className="text-white/90 text-sm mt-2 inline-flex items-center gap-2 group-hover:underline underline-offset-4">Explorar <ArrowRight size={14} /></span>
              </div>
            </Link>
            
            <Link to="/catalogo?category=Hombre" className="group relative h-[500px] overflow-hidden bg-stone-200">
              <img src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=85" alt="Hombre" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white text-3xl font-medium tracking-wide">Hombre</h3>
                <span className="text-white/90 text-sm mt-2 inline-flex items-center gap-2 group-hover:underline underline-offset-4">Explorar <ArrowRight size={14} /></span>
              </div>
            </Link>

            <Link to="/catalogo?category=Accesorios" className="group relative h-[500px] overflow-hidden bg-stone-200">
              <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85" alt="Accesorios" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white text-3xl font-medium tracking-wide">Accesorios</h3>
                <span className="text-white/90 text-sm mt-2 inline-flex items-center gap-2 group-hover:underline underline-offset-4">Explorar <ArrowRight size={14} /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 border-t border-neutral-200 bg-white">
        <div className="container-page grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center mb-6 text-neutral-900">
              <Truck size={24} strokeWidth={1.5} />
            </div>
            <h4 className="text-lg font-medium tracking-wide mb-2">Envíos a todo el país</h4>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">Despachamos tus pedidos dentro de las 24hs hábiles a cualquier punto del país.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center mb-6 text-neutral-900">
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <h4 className="text-lg font-medium tracking-wide mb-2">Compra segura</h4>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">Tus datos están protegidos. Procesamos todos los pagos a través de Mercado Pago.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center mb-6 text-neutral-900">
              <Clock size={24} strokeWidth={1.5} />
            </div>
            <h4 className="text-lg font-medium tracking-wide mb-2">Cambios rápidos</h4>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">Tenés 30 días para realizar cambios o devoluciones de forma simple y rápida.</p>
          </div>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}} />
    </>
  );
}
