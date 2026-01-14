
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { MOCK_TICKETS } from '../constants';

type OperationalTab = 'Nuevos' | 'En proceso' | 'Terminados';
type GroupFilter = 'Global' | 'Grupo A' | 'Grupo B';

export const TicketsList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<GroupFilter>('Global');
  const [activeTab, setActiveTab] = useState<OperationalTab>('Nuevos');

  // Filtrado lógico por Grupo
  const groupFilteredTickets = useMemo(() => {
    if (selectedGroup === 'Global') return MOCK_TICKETS;
    return MOCK_TICKETS.filter(t => t.group === selectedGroup);
  }, [selectedGroup]);

  // Stats calculados dinámicamente según el grupo
  const stats = useMemo(() => {
    return {
      total: groupFilteredTickets.length,
      pendientes: groupFilteredTickets.filter(t => t.status === 'Pendiente').length,
      proceso: groupFilteredTickets.filter(t => t.status === 'En Proceso').length,
      aprobados: groupFilteredTickets.filter(t => t.status === 'Aprobado').length,
      cerrados: groupFilteredTickets.filter(t => t.status === 'Cerrado').length,
    };
  }, [groupFilteredTickets]);

  // Filtrado final por Tab Operativa (Fase)
  const finalTickets = useMemo(() => {
    switch(activeTab) {
      case 'Nuevos': return groupFilteredTickets.filter(t => t.status === 'Pendiente');
      case 'En proceso': return groupFilteredTickets.filter(t => t.status === 'En Proceso' || t.status === 'Aprobado');
      case 'Terminados': return groupFilteredTickets.filter(t => t.status === 'Cerrado' || t.status === 'Solucionado');
      default: return groupFilteredTickets;
    }
  }, [activeTab, groupFilteredTickets]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      {/* Requisito: Buscador y Botón Nuevo Ticket en el Header */}
      <Header title="Tickets" breadcrumbs={[{ label: 'Operaciones' }]} showActions={true} />
      
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
        
        {/* Requisito: Filtrar por Grupo */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              Gestión de <span className="text-primary">Servicios</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-2 font-black uppercase tracking-widest">Filtre por grupo para ver métricas específicas</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {['Global', 'Grupo A', 'Grupo B'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g as GroupFilter)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedGroup === g ? 'bg-primary text-black' : 'text-slate-500 hover:text-white'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Requisito: Stats (Total, Pendientes, En Proceso, Aprobados, Cerrados) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-white', icon: 'analytics' },
            { label: 'Pendientes', value: stats.pendientes, color: 'text-primary', icon: 'timer' },
            { label: 'En proceso', value: stats.proceso, color: 'text-accent-blue', icon: 'running_with_errors' },
            { label: 'Aprobados', value: stats.aprobados, color: 'text-emerald-500', icon: 'check_circle' },
            { label: 'Cerrados', value: stats.cerrados, color: 'text-slate-500', icon: 'history' }
          ].map((s, i) => (
            <div key={i} className="bg-card-dark border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col gap-2 shadow-lg">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                <span className={`material-symbols-outlined text-lg opacity-20 ${s.color}`}> {s.icon} </span>
              </div>
              <p className={`text-3xl font-black font-mono ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Requisito: Cambiar parte operativa (Nuevos, En proceso, Terminados) */}
        <div className="flex border-b border-white/5 gap-8">
          {['Nuevos', 'En proceso', 'Terminados'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as OperationalTab)}
              className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_#f2a20d]"></div>}
            </button>
          ))}
        </div>

        {/* Listado: Estado Operativo, Nombre y Acciones */}
        <div className="bg-card-dark border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/10">
                  <th className="px-6 py-5">Nombre / Sucursal</th>
                  <th className="px-6 py-5">Estado Operativo</th>
                  <th className="px-6 py-5">Grupo / Tipo</th>
                  <th className="px-6 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {finalTickets.map((tk) => (
                  <tr key={tk.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center font-mono font-black text-[10px] text-white/20 border border-white/10">
                          {tk.id.slice(-3)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{tk.location}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{tk.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                        tk.status === 'Pendiente' ? 'bg-primary/10 text-primary border-primary/20' : 
                        tk.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        tk.status === 'Cerrado' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' :
                        'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
                      }`}>
                        <span className="text-[9px] font-black uppercase tracking-widest">{tk.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[10px] font-black text-white/60 uppercase">{tk.group}</p>
                      <p className="text-[9px] text-slate-600 font-bold uppercase">{tk.type}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => navigate('/step3')}
                        className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all border border-white/5"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
