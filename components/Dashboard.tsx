
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../api.service';
import { Ticket } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<'week' | 'month'>('week');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    amount: 0,
    accepted: 0,
    waiting: 0,
    solved: 0,
    closed: 0
  });

  const dataWeekly = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      return {
        date: dateStr,
        nuevos: tickets.filter(t => t.status === 'Pendiente').length,
        espera: tickets.filter(t => t.status === 'En Proceso').length,
        solucionados: tickets.filter(t => t.status === 'Solucionado').length
      };
    });
  }, [tickets]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await api.getTickets();
        if (Array.isArray(data)) {
          setTickets(data);

          // Calcular estadísticas reales
          const s = {
            total: data.length,
            amount: data.reduce((acc, t) => acc + (Number(t.amount) || 0), 0),
            accepted: data.filter(t => t.status === 'Aprobado').length,
            waiting: data.filter(t => t.status === 'Pendiente' || t.status === 'En Proceso').length,
            solved: data.filter(t => t.status === 'Solucionado').length,
            closed: data.filter(t => t.status === 'Cerrado').length
          };
          setStats(s);
        }
      } catch (e) {
        console.error("Dashboard load failed", e);
      }
    };
    fetchDashboardData();
  }, []);

  const mainStats = [
    { label: 'Total de tickets', count: stats.total.toString(), amount: `$${stats.amount.toLocaleString()}`, color: 'text-white', status: 'Consolidado global', dot: 'bg-slate-400' },
    { label: 'Aceptado', count: stats.accepted.toString(), amount: '-', color: 'text-primary', status: 'Por cobrar', dot: 'bg-primary' },
    { label: 'En espera', count: stats.waiting.toString(), amount: '-', color: 'text-accent-blue', status: 'Pendiente de aprobación', dot: 'bg-accent-blue' },
    { label: 'Solucionado', count: stats.solved.toString(), amount: '-', color: 'text-emerald-500', status: 'Ya recaudado', dot: 'bg-emerald-500' },
    { label: 'Cerrado', count: stats.closed.toString(), amount: '-', color: 'text-slate-500', status: 'Finalizado', dot: 'bg-slate-600' }
  ];

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
