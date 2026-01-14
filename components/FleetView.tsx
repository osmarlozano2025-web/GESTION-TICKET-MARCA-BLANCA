
import React, { useState } from 'react';
import { Header } from './Header';
import { AppVehicle } from '../types';

export const FleetView: React.FC = () => {
  // Simulación de rol de usuario (cambiar a 'Tech' para ver la vista restringida)
  const [userRole] = useState<'Admin' | 'Tech'>('Admin');
  
  const [vehicles, setVehicles] = useState<AppVehicle[]>([
    { id: 'UNIT-01', model: 'Toyota Hilux 2023', plate: 'ABC-123', km: 42500, nextServiceKm: 45000, vtvExpiry: '2025-10-15', btoEnabled: true, active: true, lastKmUpdate: '2024-10-21' },
    { id: 'UNIT-02', model: 'Ford Transit 2022', plate: 'XYZ-987', km: 19850, nextServiceKm: 20000, vtvExpiry: '2024-05-12', btoEnabled: false, active: true, lastKmUpdate: '2024-10-14' }, // Pendiente (hace +7 días)
    { id: 'UNIT-03', model: 'Nissan NP300 2024', plate: 'LMN-456', km: 5200, nextServiceKm: 10000, vtvExpiry: '2025-01-20', btoEnabled: true, active: false, lastKmUpdate: '2024-10-24' },
  ]);

  const [kmModalVehicle, setKmModalVehicle] = useState<AppVehicle | null>(null);
  const [adminEditVehicle, setAdminEditVehicle] = useState<AppVehicle | null>(null);
  const [newKmValue, setNewKmValue] = useState<number>(0);

  const isUpdatePending = (lastUpdate: string) => {
    const last = new Date(lastUpdate);
    const now = new Date();
    const diff = now.getTime() - last.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days >= 7; // Más de una semana sin actualizar
  };

  const checkVtvStatus = (expiry: string) => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: 'VTV VENCIDA', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (diffDays <= 30) return { label: 'VTV POR VENCER', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    return { label: 'VTV AL DÍA', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  };

  const handleKmUpdateSubmit = () => {
    if (!kmModalVehicle) return;
    if (newKmValue < kmModalVehicle.km) {
      alert("El kilometraje no puede ser inferior al anterior.");
      return;
    }

    setVehicles(prev => prev.map(v => v.id === kmModalVehicle.id ? { 
      ...v, 
      km: newKmValue, 
      lastKmUpdate: new Date().toISOString().split('T')[0] 
    } : v));
    setKmModalVehicle(null);
  };

  const handleAdminUpdate = () => {
    if (!adminEditVehicle) return;
    setVehicles(prev => prev.map(v => v.id === adminEditVehicle.id ? adminEditVehicle : v));
    setAdminEditVehicle(null);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      <Header title="Flota Operativa" breadcrumbs={[{ label: 'Flota' }]} />
      
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
        {/* Banner de Alerta para el Admin si hay unidades desactualizadas */}
        {userRole === 'Admin' && vehicles.some(v => isUpdatePending(v.lastKmUpdate)) && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-red-500">warning</span>
              <div>
                <p className="text-red-500 text-xs font-black uppercase tracking-widest">Alerta de Supervisión</p>
                <p className="text-white/60 text-[10px] font-bold">Existen unidades sin reporte semanal de kilometraje. Se ha enviado notificación a los responsables.</p>
              </div>
            </div>
            <button className="text-[10px] font-black uppercase text-red-500 hover:underline">Solicitar Reportes</button>
          </div>
        )}

        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              Estado de la <span className="text-primary">Flota</span>
            </h2>
            <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">
              {userRole === 'Admin' ? 'Gestión administrativa completa' : 'Reporte de uso semanal requerido'}
            </p>
          </div>
          {userRole === 'Admin' && (
            <button className="bg-primary text-black font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg">Nueva Unidad</button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => {
            const pending = isUpdatePending(v.lastKmUpdate);
            const vtv = checkVtvStatus(v.vtvExpiry);

            return (
              <div key={v.id} className={`bg-card-dark border rounded-3xl p-6 transition-all group flex flex-col shadow-2xl relative overflow-hidden ${pending ? 'border-primary/40 ring-1 ring-primary/20' : 'border-white/5'}`}>
                {pending && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-primary"></div>
                )}
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${v.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
                    <span className="text-[10px] font-black uppercase text-slate-500">{v.active ? 'Activo' : 'Baja'}</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-white/5 ${vtv.bg} ${vtv.color}`}>
                    {vtv.label}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-slate-400">
                    <span className="material-symbols-outlined text-3xl">local_shipping</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{v.id}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{v.model}</p>
                    <p className="text-[9px] text-primary/60 font-mono">{v.plate}</p>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Recorrido Actual</p>
                      <p className={`text-2xl font-black font-mono ${pending ? 'text-primary animate-pulse' : 'text-white'}`}>
                        {v.km.toLocaleString()} <span className="text-xs">KM</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-slate-500 font-black uppercase">Última Carga</p>
                      <p className="text-[10px] text-white/60 font-bold">{v.lastKmUpdate}</p>
                    </div>
                  </div>
                  {pending && (
                    <div className="mt-3 py-2 px-3 bg-primary/10 rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">update</span>
                      <span className="text-[9px] font-black uppercase text-primary tracking-tighter">Actualización Semanal Obligatoria Pendiente</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-auto">
                  {/* El usuario regular SOLO ve el botón de actualizar KM */}
                  <button 
                    onClick={() => { setKmModalVehicle(v); setNewKmValue(v.km); }}
                    className="w-full py-3 rounded-xl bg-primary text-black font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Actualizar Kilometraje
                  </button>
                  
                  {/* El Admin ve todas las opciones */}
                  {userRole === 'Admin' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setAdminEditVehicle(v)}
                        className="flex-1 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all border border-white/5"
                      >
                        Config. Técnica
                      </button>
                      <button className="px-3 rounded-xl bg-white/5 text-slate-500 hover:text-primary border border-white/5 transition-colors">
                        <span className="material-symbols-outlined text-sm">history</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Carga KM (Única acción habilitada para usuarios) */}
      {kmModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-card-dark border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-8 space-y-8">
            <div className="text-center">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 border border-primary/20">
                <span className="material-symbols-outlined text-3xl font-black">speed</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Reporte <span className="text-primary">Kilometraje</span></h3>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Unidad: {kmModalVehicle.id}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 text-center">
                <label className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Kilometraje Actualizado</label>
                <div className="relative">
                   <input 
                    type="number" 
                    value={newKmValue}
                    onChange={e => setNewKmValue(parseInt(e.target.value))}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-4xl font-black text-white text-center font-mono focus:border-primary outline-none transition-all shadow-inner" 
                  />
                  <div className="absolute right-4 bottom-4 text-slate-500 font-black text-xs">KM</div>
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase italic mt-2">Valor anterior registrado: {kmModalVehicle.km} KM</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setKmModalVehicle(null)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  Cerrar
                </button>
                <button 
                  onClick={handleKmUpdateSubmit}
                  className="flex-[2] py-4 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Enviar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Admin Edit (Solo Admin) */}
      {adminEditVehicle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-surface-dark border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Maestro de <span className="text-primary">Unidad</span></h3>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Configuración técnica de flota avanzada</p>
              </div>
              <button onClick={() => setAdminEditVehicle(null)} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-[9px] text-primary font-black uppercase tracking-widest">Modelo / Año</label>
                  <input type="text" value={adminEditVehicle.model} onChange={e => setAdminEditVehicle({...adminEditVehicle, model: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-primary font-black uppercase tracking-widest">Patente / Placa</label>
                  <input type="text" value={adminEditVehicle.plate} onChange={e => setAdminEditVehicle({...adminEditVehicle, plate: e.target.value.toUpperCase()})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none uppercase font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-primary font-black uppercase tracking-widest">Vencimiento VTV</label>
                  <input type="date" value={adminEditVehicle.vtvExpiry} onChange={e => setAdminEditVehicle({...adminEditVehicle, vtvExpiry: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-primary font-black uppercase tracking-widest">Service Próximo (KM)</label>
                  <input type="number" value={adminEditVehicle.nextServiceKm} onChange={e => setAdminEditVehicle({...adminEditVehicle, nextServiceKm: parseInt(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none" />
                </div>
              </div>
              <div className="flex gap-4">
                 <div className="flex-1 p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                  <p className="text-[10px] text-white font-bold">BTO</p>
                  <button onClick={() => setAdminEditVehicle({...adminEditVehicle, btoEnabled: !adminEditVehicle.btoEnabled})} className={`size-6 rounded-md border flex items-center justify-center transition-all ${adminEditVehicle.btoEnabled ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/10 text-transparent'}`}><span className="material-symbols-outlined text-[16px] font-black">check</span></button>
                </div>
                <div className="flex-1 p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                  <p className="text-[10px] text-white font-bold">Habilitado</p>
                  <button onClick={() => setAdminEditVehicle({...adminEditVehicle, active: !adminEditVehicle.active})} className={`size-6 rounded-md border flex items-center justify-center transition-all ${adminEditVehicle.active ? 'bg-primary border-primary text-black' : 'border-white/10 text-transparent'}`}><span className="material-symbols-outlined text-[16px] font-black">check</span></button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
              <button onClick={() => setAdminEditVehicle(null)} className="flex-1 py-4 text-[10px] font-black uppercase text-white/40">Descartar</button>
              <button onClick={handleAdminUpdate} className="flex-[2] py-4 bg-primary text-black text-[10px] font-black uppercase rounded-xl">Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
