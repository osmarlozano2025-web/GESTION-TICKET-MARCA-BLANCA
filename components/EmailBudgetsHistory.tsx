
import React, { useState } from 'react';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';

export const EmailBudgetsHistory: React.FC = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([
    { id: '#TK-9011', client: 'Retail Corp', status: 'NP', date: '2024-10-24', amount: '$1,200', location: 'Sucursal Poniente' },
    { id: '#TK-8722', client: 'Gasolineras del Norte', status: 'PE', date: '2024-10-23', amount: '$850', location: 'Estación Central' },
    { id: '#TK-8850', client: 'Logística Global', status: 'PA', date: '2024-10-22', amount: '$2,400', location: 'Almacén 4' },
    { id: '#TK-8910', client: 'Retail Corp', status: 'PR', date: '2024-10-21', amount: '$3,100', location: 'Sucursal Sur' },
    { id: '#TK-9044', client: 'Banco Financiero', status: 'NP', date: '2024-10-20', amount: '$450', location: 'Sede Principal' },
  ]);

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'NP': return { label: 'No presupuestado', style: 'bg-red-500/10 text-red-500 border-red-500/20' };
      case 'PE': return { label: 'Presupuestado en espera', style: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
      case 'PA': return { label: 'Presupuesto aceptado', style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
      case 'PR': return { label: 'Presupuesto rechazado', style: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
      default: return { label: 'Desconocido', style: 'bg-white/5 text-white/40 border-white/10' };
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      <Header title="Presupuestos por Email" breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Historial Email' }]} />
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Historial <span className="text-primary">Presupuestos Email</span></h2>
            <p className="text-slate-500 text-sm mt-1">Control consolidado de tickets gestionados fuera de LPH.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all">Volver al Panel</button>
             <button className="px-6 py-2.5 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-lg shadow-lg hover:scale-105 transition-all">Exportar Datos</button>
          </div>
        </div>

        <div className="bg-card-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/10">
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Cliente / Ubicación</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Monto Est.</th>
                <th className="px-6 py-4">Estado Presupuesto</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {budgets.map((b, i) => {
                const info = getStatusInfo(b.status);
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono text-sm text-primary font-bold">{b.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{b.client}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{b.location}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{b.date}</td>
                    <td className="px-6 py-4 font-mono font-black text-white">{b.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${info.style}`}>
                        {info.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
