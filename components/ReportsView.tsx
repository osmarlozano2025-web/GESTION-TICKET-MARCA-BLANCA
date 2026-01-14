
import React from 'react';
import { Header } from './Header';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const ReportsView: React.FC = () => {
  const pieData = [
    { name: 'Preventivo', value: 400 },
    { name: 'Correctivo', value: 300 },
    { name: 'Emergencia', value: 300 },
  ];
  const COLORS = ['#f2a20d', '#63b3ed', '#f87171'];

  const lineData = [
    { name: 'Ene', sla: 92 },
    { name: 'Feb', sla: 88 },
    { name: 'Mar', sla: 95 },
    { name: 'Abr', sla: 99 },
    { name: 'May', sla: 97 },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      <Header title="Inteligencia de Negocio" breadcrumbs={[{ label: 'Reportes' }]} />
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card-dark p-6 rounded-2xl border border-white/5">
            <h3 className="text-white font-bold mb-6">Distribución de Tipos de Ticket</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card-dark p-6 rounded-2xl border border-white/5">
            <h3 className="text-white font-bold mb-6">Cumplimiento SLA (%)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="sla" stroke="#f2a20d" strokeWidth={3} dot={{ fill: '#f2a20d', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
