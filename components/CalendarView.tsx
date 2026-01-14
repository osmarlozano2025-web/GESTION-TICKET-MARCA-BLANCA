
import React from 'react';
import { Header } from './Header';

export const CalendarView: React.FC = () => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const events = [
    { date: 5, title: 'Preventivo Tienda Sante Fe', type: 'maint' },
    { date: 12, title: 'Revisión Flota Norte', type: 'fleet' },
    { date: 18, title: 'Auditoría Inventario', type: 'admin' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      <Header title="Agenda Operativa" breadcrumbs={[{ label: 'Agenda' }]} />
      <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-black text-white uppercase italic">Octubre <span className="text-primary">2024</span></h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"><span className="material-symbols-outlined">chevron_left</span></button>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {days.map(d => (
            <div key={d} className="bg-surface-dark p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
              {d}
            </div>
          ))}
          {dates.map(date => {
            const dayEvents = events.filter(e => e.date === date);
            return (
              <div key={date} className="bg-card-dark min-h-[120px] p-2 hover:bg-white/[0.02] transition-colors border-t border-white/5">
                <span className="text-xs font-bold text-slate-600">{date}</span>
                <div className="mt-2 space-y-1">
                  {dayEvents.map((e, idx) => (
                    <div key={idx} className="text-[9px] p-1.5 rounded bg-primary/10 border-l-2 border-primary text-primary font-bold truncate">
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
