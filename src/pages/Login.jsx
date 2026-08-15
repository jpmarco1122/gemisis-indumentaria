import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr('Credenciales incorrectas o error de conexión.');
    else nav('/admin');
    setLoading(false);
  }

  return (
    <div className="container-page max-w-md py-20 md:py-32">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">Acceso al sistema</h1>
        <p className="text-neutral-500">Ingresá tus credenciales para administrar la tienda.</p>
      </div>
      
      <div className="bg-white p-8 border border-neutral-200">
        <form onSubmit={submit} className="grid gap-6">
          <label className="grid gap-2 text-sm text-neutral-600 font-medium">
            Correo electrónico
            <input 
              required 
              type="email" 
              placeholder="admin@ejemplo.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="border border-neutral-300 p-4 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50" 
            />
          </label>
          <label className="grid gap-2 text-sm text-neutral-600 font-medium">
            Contraseña
            <input 
              required 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="border border-neutral-300 p-4 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all bg-stone-50" 
            />
          </label>
          
          <button 
            disabled={loading} 
            className="w-full bg-neutral-900 py-4 text-white text-sm font-medium tracking-wide uppercase disabled:opacity-70 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors flex justify-center items-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
          
          {err && (
            <div className="bg-red-50 text-red-600 p-4 text-sm font-medium text-center border border-red-200 mt-2">
              {err}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
