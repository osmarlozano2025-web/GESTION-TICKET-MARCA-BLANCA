
import React from 'react';
import { Header } from './Header';

export const TeamManagement: React.FC = () => {
  const technicians = [
    { name: 'Juan Díaz', role: 'Electricista Senior', status: 'In Site', task: '#TK-8829', battery: '88%' },
    { name: 'Juana Silva', role: 'Telecomunicaciones', status: 'Traveling', task: '#TK-9102', battery: '95%' },
    { name: 'Miguel Rojas', role: 'Infraestructura', status: 'Available', task: 'None', battery: '42%' },
    { name: 'Carla Mendoza', role: 'Climatización', status: 'Off Duty', task: 'None', battery: '10%' }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      <Header title="Gestión de Recursos" breadcrumbs={[{ label: 'Técnicos' }]} />
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Fuerza <span className="text-primary">Técnica</span></h2>
          <p className="text-slate-500 text-sm mt-1">Monitoreo de disponibilidad y carga operativa en tiempo real.</p>
        </div>

        <div className="bg-card-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/10">
                <th className="px-6 py-4">Técnico</th>
                <th className="px-6 py-4">Especialidad</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Asignación Actual</th>
                <th className="px-6 py-4">Dispositivo</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {technicians.map((t, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-primary">{t.name.split(' ').map(n => n[0]).join('')}</div>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">{t.role}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      t.status === 'In Site' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      t.status === 'Traveling' ? 'bg-primary/10 text-primary border-primary/20' :
                      t.status === 'Available' ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20' :
                      'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        t.status === 'In Site' ? 'bg-emerald-500 animate-pulse' :
                        t.status === 'Traveling' ? 'bg-primary animate-bounce' :
                        t.status === 'Available' ? 'bg-accent-blue' : 'bg-slate-500'
                      }`}></span>
                      {t.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-white/60">{t.task}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-slate-500">battery_charging_full</span>
                      <span className="text-[10px] font-black text-slate-500">{t.battery}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
