
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../types';

interface HeaderProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  showActions?: boolean; 
}

export const Header: React.FC<HeaderProps> = ({ title, breadcrumbs, showActions = false }) => {
  const navigate = useNavigate();
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {title && <h2 className="text-xl font-bold tracking-tight">{title}</h2>}
        {breadcrumbs && (
          <>
            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
            <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={idx}>
                  <span 
                    className={`${bc.path ? 'hover:text-primary cursor-pointer' : ''}`} 
                    onClick={() => bc.path && navigate(bc.path)}
                  >
                    {bc.label}
                  </span>
                  {idx < breadcrumbs.length - 1 && <span className="material-symbols-outlined text-xs">chevron_right</span>}
                </React.Fragment>
              ))}
            </nav>
          </>
        )}
      </div>
      {showActions && (
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input 
              className="bg-slate-100 dark:bg-background-dark border-none rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary w-64" 
              placeholder="Buscar..." 
              type="text"
            />
          </div>
          <button 
            onClick={() => navigate('/step1')} 
            className="bg-primary hover:bg-primary/90 text-background-dark px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Nuevo Ticket
          </button>
        </div>
      )}
    </header>
  );
};
