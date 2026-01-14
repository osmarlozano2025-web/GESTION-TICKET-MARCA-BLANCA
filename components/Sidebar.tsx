
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState({ name: 'TechOps', tagline: 'Pro Control', logo: '' });

  useEffect(() => {
    const updateBrand = () => {
      const saved = localStorage.getItem('company_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompanyInfo({
          name: parsed.name || 'TechOps',
          tagline: parsed.tagline || 'Pro Control',
          logo: parsed.logoUrl || ''
        });
      }
    };

    updateBrand();
    window.addEventListener('company_settings_updated', updateBrand);
    return () => window.removeEventListener('company_settings_updated', updateBrand);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon, label, badge, badgeColor = 'bg-primary/20 text-primary' }: { to: string, icon: string, label: string, badge?: string, badgeColor?: string }) => (
    <Link to={to} className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive(to) ? 'bg-primary/10 text-primary shadow-[inset_0_0:10px_rgba(242,162,13,0.05)]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
      <span className={`material-symbols-outlined text-[20px] ${isActive(to) ? 'fill-1' : ''}`}>{icon}</span>
      <span className="text-sm font-semibold flex-1">{label}</span>
      {badge && <span className={`${badgeColor} text-[10px] px-1.5 py-0.5 rounded-md font-black`}>{badge}</span>}
    </Link>
  );

  const SectionLabel = ({ label }: { label: string }) => (
    <p className="px-3 mt-6 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</p>
  );

  return (
    <aside className="w-64 border-r border-white/5 bg-deep-black flex flex-col h-screen sticky top-0 shrink-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="bg-primary size-10 flex items-center justify-center rounded-xl text-background-dark shadow-[0_0_20px_rgba(242,162,13,0.3)] group-hover:scale-110 transition-transform overflow-hidden">
            {companyInfo.logo ? (
              <img src={companyInfo.logo} className="w-full h-full object-cover" alt="Logo" />
            ) : (
              <span className="material-symbols-outlined font-bold">query_stats</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black uppercase tracking-widest text-white truncate">
              {companyInfo.name.split(' ')[0]}<span className="text-primary">{companyInfo.name.split(' ').slice(1).join(' ') || ''}</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{companyInfo.tagline}</p>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItem to="/" icon="dashboard" label="Dashboard" />
          
          <SectionLabel label="Operaciones" />
          <div className="space-y-1">
             <Link to="/tickets" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${location.pathname.includes('/tickets') || location.pathname.includes('/step') ? 'text-primary bg-primary/5' : 'text-slate-500 hover:text-white'}`}>
              <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
              <span className="text-sm font-semibold">Tickets</span>
              <span className="material-symbols-outlined ml-auto text-sm opacity-40">chevron_right</span>
            </Link>
            <NavItem to="/materials" icon="shopping_cart" label="Materiales" badge="4" />
          </div>

          <SectionLabel label="Recursos" />
          <NavItem to="/clients" icon="corporate_fare" label="Clientes" />
          <NavItem to="/users" icon="group" label="Usuarios" />
          <NavItem to="/fleet" icon="local_shipping" label="Flota" badge="Alertas" badgeColor="bg-red-500/20 text-red-500" />

          <SectionLabel label="Finanzas" />
          <NavItem to="/petty-cash" icon="account_balance_wallet" label="Caja Chica" />

          <SectionLabel label="Inteligencia" />
          <NavItem to="/settings" icon="settings" label="Configuración" />
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/5">
          <div className="size-10 rounded-xl bg-slate-800 overflow-hidden ring-2 ring-primary/20">
            <img alt="Admin" src="https://picsum.photos/seed/techadmin/100/100" className="w-full h-full object-cover"/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate">Alex Operador</p>
            <p className="text-[9px] text-primary font-bold uppercase">Super Admin</p>
          </div>
          <button className="text-slate-500 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
