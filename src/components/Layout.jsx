import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, UserRound, Menu, X, ArrowRight, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../context';

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const { totalItems, session, isCartOpen, setIsCartOpen, cart, remove, update, subtotal, toast } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
  }, [location.pathname]);

  function submitSearch(e) {
    e.preventDefault();
    if (q.trim()) {
      nav(`/catalogo?search=${encodeURIComponent(q)}`);
      setIsMobileMenuOpen(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Banner (Optional for Premium Feel) */}
      <div className="bg-neutral-900 text-stone-50 text-[11px] font-medium tracking-[0.1em] uppercase text-center py-2 px-4 flex justify-center items-center gap-2">
        <span>Envíos gratis en compras superiores a $150.000</span>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-stone-50/90 backdrop-blur-md border-b border-neutral-200/50 shadow-sm' : 'bg-stone-50'}`}>
        <div className="container-page flex h-20 items-center justify-between gap-4">
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-[0.15em] uppercase flex-shrink-0">
            GEMINIS
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium tracking-wide">
            <NavLink to="/catalogo" className={({isActive}) => `relative hover:text-neutral-500 transition-colors ${isActive ? 'after:content-[\'\'] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-neutral-900' : ''}`}>Colección</NavLink>
            <NavLink to="/catalogo?category=Mujer" className="hover:text-neutral-500 transition-colors">Mujer</NavLink>
            <NavLink to="/catalogo?category=Hombre" className="hover:text-neutral-500 transition-colors">Hombre</NavLink>
          </nav>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-5 justify-end">
            <form onSubmit={submitSearch} className="hidden lg:flex items-center border-b border-neutral-300 pb-1 group focus-within:border-neutral-900 transition-colors">
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar..." className="w-32 xl:w-48 bg-transparent text-sm outline-none placeholder:text-neutral-400" />
              <button type="submit" className="text-neutral-400 group-focus-within:text-neutral-900 transition-colors"><Search size={18} strokeWidth={1.5} /></button>
            </form>
            <Link to={session ? '/admin' : '/login'} className="text-neutral-600 hover:text-neutral-900 transition-colors hidden sm:block">
              <UserRound size={22} strokeWidth={1.5} />
            </Link>
            <button className="relative text-neutral-600 hover:text-neutral-900 transition-colors p-1 -mr-1" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={22} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white shadow-sm ring-2 ring-stone-50">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-stone-50 shadow-2xl p-6 flex flex-col animate-[slideRight_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold tracking-[0.15em]">GEMINIS</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-neutral-500 hover:text-neutral-900"><X size={24} strokeWidth={1.5} /></button>
            </div>
            <form onSubmit={submitSearch} className="mb-8 flex items-center border-b border-neutral-300 pb-2">
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar productos..." className="w-full bg-transparent text-base outline-none" />
              <button type="submit"><Search size={20} className="text-neutral-400" /></button>
            </form>
            <nav className="flex flex-col gap-6 text-lg tracking-wide font-medium">
              <Link to="/catalogo" className="hover:text-neutral-500">Tienda Completa</Link>
              <Link to="/catalogo?category=Mujer" className="hover:text-neutral-500">Mujer</Link>
              <Link to="/catalogo?category=Hombre" className="hover:text-neutral-500">Hombre</Link>
              <Link to="/seguimiento" className="hover:text-neutral-500 mt-4 pt-4 border-t border-neutral-200">Seguimiento de pedido</Link>
              <Link to={session ? '/admin' : '/login'} className="hover:text-neutral-500">Mi Cuenta</Link>
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-stone-50 shadow-2xl flex flex-col animate-[slideLeft_0.3s_ease-out]">
            <div className="flex justify-between items-center p-6 border-b border-neutral-200">
              <h2 className="text-lg font-medium tracking-wide">Tu Carrito ({totalItems})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 -mr-2 text-neutral-500 hover:text-neutral-900"><X size={24} strokeWidth={1.5} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {!cart.length ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-neutral-500">
                  <ShoppingBag size={48} strokeWidth={1} className="text-neutral-300" />
                  <p>Tu carrito está vacío.</p>
                  <button onClick={() => {setIsCartOpen(false); nav('/catalogo');}} className="mt-4 text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors">Explorar colección</button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {cart.map(i => (
                    <div className="flex gap-4 group" key={i.key}>
                      <Link to={`/producto/${i.product.slug || i.product.id}`} onClick={() => setIsCartOpen(false)} className="h-28 w-20 bg-stone-100 flex-shrink-0 overflow-hidden relative">
                        {i.product.image_url ? <img src={i.product.image_url} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /> : null}
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <Link to={`/producto/${i.product.slug || i.product.id}`} onClick={() => setIsCartOpen(false)} className="font-medium text-sm leading-tight hover:underline underline-offset-2 line-clamp-2">{i.product.name}</Link>
                            <button onClick={() => remove(i.key)} className="text-neutral-400 hover:text-neutral-900 p-1 -mr-1"><X size={16} /></button>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 capitalize">{i.variant?.size} {i.variant?.color ? `· ${i.variant.color}` : ''}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-neutral-300 rounded-sm">
                            <button className="px-2 py-1 text-neutral-500 hover:bg-neutral-100 transition-colors" onClick={() => update(i.key, i.quantity - 1)}>-</button>
                            <span className="px-2 text-xs font-medium min-w-[2rem] text-center">{i.quantity}</span>
                            <button className="px-2 py-1 text-neutral-500 hover:bg-neutral-100 transition-colors" onClick={() => update(i.key, i.quantity + 1)}>+</button>
                          </div>
                          <p className="font-medium text-sm">${(i.product.price * i.quantity).toLocaleString('es-AR')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="border-t border-neutral-200 p-6 bg-white">
                <div className="flex justify-between text-base font-medium mb-6">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-AR')}</span>
                </div>
                <button onClick={() => { setIsCartOpen(false); nav('/checkout'); }} className="w-full bg-neutral-900 text-white py-4 font-medium tracking-wide hover:bg-neutral-800 transition-colors flex justify-center items-center gap-2">
                  Finalizar compra <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 rounded-none bg-neutral-900 px-6 py-4 text-sm font-medium text-white shadow-xl toast-enter">
          <Check size={18} className="text-green-400" />
          {toast}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="container-page py-16 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="text-xl font-bold tracking-[0.15em] mb-4">GEMINIS</div>
            <p className="text-neutral-500 leading-relaxed max-w-xs">
              Diseño minimalista y contemporáneo para quienes buscan elegancia en lo simple. Prendas seleccionadas que trascienden temporadas.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 tracking-wide uppercase text-xs">Tienda</h4>
            <div className="grid gap-3 text-neutral-500">
              <Link to="/catalogo?category=Mujer" className="hover:text-neutral-900 transition-colors">Mujer</Link>
              <Link to="/catalogo?category=Hombre" className="hover:text-neutral-900 transition-colors">Hombre</Link>
              <Link to="/catalogo" className="hover:text-neutral-900 transition-colors">Ver todo</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 tracking-wide uppercase text-xs">Soporte</h4>
            <div className="grid gap-3 text-neutral-500">
              <Link to="/seguimiento" className="hover:text-neutral-900 transition-colors">Seguimiento de pedido</Link>
              <a href="#" className="hover:text-neutral-900 transition-colors">Preguntas frecuentes</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Cambios y devoluciones</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 tracking-wide uppercase text-xs">Contacto</h4>
            <p className="text-neutral-500 mb-2">hello@geminis.com</p>
            <p className="text-neutral-500 mb-4">+54 11 1234 5678</p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-neutral-900 transition-colors">IG</a>
              <a href="#" className="text-neutral-400 hover:text-neutral-900 transition-colors">TK</a>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-100">
          <div className="container-page py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
            <p>© {new Date().getFullYear()} Geminis Indumentaria. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-neutral-900">Privacidad</a>
              <a href="#" className="hover:text-neutral-900">Términos</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Internal Animations (Slide left/right for drawers) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
