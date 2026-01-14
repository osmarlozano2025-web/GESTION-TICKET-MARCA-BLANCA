
import React, { useState } from 'react';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const dataWeekly = [
  { date: '18 Oct', nuevos: 12, espera: 18, solucionados: 25 },
  { date: '19 Oct', nuevos: 20, espera: 12, solucionados: 30 },
  { date: '20 Oct', nuevos: 15, espera: 25, solucionados: 20 },
  { date: '21 Oct', nuevos: 30, espera: 15, solucionados: 35 },
  { date: '22 Oct', nuevos: 10, espera: 20, solucionados: 45 },
  { date: '23 Oct', nuevos: 8, espera: 12, solucionados: 15 },
  { date: '24 Oct', nuevos: 5, espera: 10, solucionados: 10 },
];

const mainStats = [
  { label: 'Total de tickets', count: '154', amount: '$42,500', color: 'text-white', status: 'Consolidado global', dot: 'bg-slate-400' },
  { label: 'Aceptado', count: '32', amount: '$12,200', color: 'text-primary', status: 'Por cobrar', dot: 'bg-primary' },
  { label: 'En espera', count: '48', amount: '$18,450', color: 'text-accent-blue', status: 'Pendiente de aprobación', dot: 'bg-accent-blue' },
  { label: 'Solucionado', count: '64', amount: '$10,800', color: 'text-emerald-500', status: 'Ya recaudado', dot: 'bg-emerald-500' },
  { label: 'Cerrado', count: '10', amount: '$1,050', color: 'text-slate-500', status: 'Perdido', dot: 'bg-slate-600' }
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<'week' | 'month'>('week');

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-dark/95">
      <Header title="Dashboard Principal" showActions={false} />
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="mb-10">
          <h2 className="text-6xl font-black tracking-tight mb-2 text-white uppercase italic leading-none">
            Panel <span className="text-primary">Ejecutivo</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm leading-relaxed font-medium">
            Resumen general de operaciones y estados financieros de tickets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {mainStats.map((stat, i) => (
            <div key={i} className="bg-card-dark border border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all group hover:border-white/20 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                <div className={`size-2 rounded-full ${stat.dot}`}></div>
              </div>
              <div className="space-y-1">
                <h3 className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.count}</h3>
                <p className="text-xl font-black font-mono text-white/90">{stat.amount}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="px-3 py-1 rounded-full bg-white/[0.03] text-white/40 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-white/5 w-fit">
                   {stat.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-card-dark rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h4 className="font-bold text-lg text-white">Flujo Semanal de Tickets</h4>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase bg-primary text-black">Semanal</button>
                <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase text-slate-500">Mensual</button>
              </div>
            </div>
            <div className="p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataWeekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#080808', border: '1px solid #333', borderRadius: '12px' }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px' }} />
                  <Bar dataKey="nuevos" name="Nuevos" fill="#f2a20d" barSize={35} />
                  <Bar dataKey="espera" name="En Espera" fill="#63b3ed" barSize={35} />
                  <Bar dataKey="solucionados" name="Solucionados" fill="#10b981" radius={[4, 4, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
