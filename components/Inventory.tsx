
import React from 'react';
import { Header } from './Header';

export const Inventory: React.FC = () => {
  const stock = [
    { name: 'Ventilador Industrial 12"', stock: 42, min: 10, unit: 'pzs', price: '$45.00' },
    { name: 'Cable UTP Cat6 305m', stock: 5, min: 8, unit: 'rollos', price: '$120.00', low: true },
    { name: 'Sensor de Proximidad Laser', stock: 124, min: 50, unit: 'pzs', price: '$22.50' },
    { name: 'Kit de Soldadura Pro', stock: 3, min: 5, unit: 'sets', price: '$350.00', low: true }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      <Header title="Control de Suministros" breadcrumbs={[{ label: 'Inventario' }]} />
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Stock de <span className="text-primary">Refacciones</span></h2>
            <p className="text-slate-500 text-sm mt-1">Gestión de insumos para mantenimiento preventivo y correctivo.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white/5 border border-white/10 text-white font-black px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Solicitar Pedido</button>
            <button className="bg-primary text-black font-black px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest shadow-lg">Nuevo Item</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stock.map((item, i) => (
            <div key={i} className="bg-card-dark border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-white/20 transition-all">
              <div className="flex items-center gap-5">
                <div className={`size-14 rounded-2xl flex items-center justify-center border ${item.low ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-primary/10 border-primary/30 text-primary'}`}>
                  <span className="material-symbols-outlined text-3xl">{item.low ? 'warning' : 'inventory_2'}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{item.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Precio Base: <span className="text-white">{item.price}</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-black font-mono ${item.low ? 'text-red-500' : 'text-white'}`}>{item.stock}</p>
                <p className="text-[9px] text-slate-500 font-black uppercase">{item.unit} Disponibles</p>
                {item.low && <p className="text-[9px] text-red-500 font-black uppercase mt-1 animate-pulse">Bajo Mínimo ({item.min})</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
