
import React, { useState } from 'react';
import { Header } from './Header';
import { MaterialRequest, MaterialRequestItem } from '../types';
import { MOCK_TICKETS } from '../constants';

export const MaterialsRequests: React.FC = () => {
  const [requests, setRequests] = useState<MaterialRequest[]>([
    { 
      id: 'REQ-101', 
      ticketId: '#TK-8829', 
      createdAt: '2024-10-24', 
      status: 'Pendiente', 
      technician: 'Juan Díaz',
      items: [
        { description: 'Cable UTP Cat6 50m', quantity: 1, source: 'Compra' },
        { description: 'Conectores RJ45', quantity: 10, source: 'Taller' }
      ]
    },
    { 
      id: 'REQ-102', 
      ticketId: '#TK-9102', 
      createdAt: '2024-10-23', 
      status: 'Surtido', 
      technician: 'Juana Silva',
      items: [
        { description: 'Sensor Movimiento', quantity: 2, source: 'Taller' }
      ]
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaterialRequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);

  // Form states for adding items
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemSource, setNewItemSource] = useState<'Taller' | 'Compra'>('Taller');

  const openNewRequest = () => {
    setEditingRequest({
      id: `REQ-${Math.floor(Math.random() * 900) + 100}`,
      ticketId: '',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pendiente',
      technician: 'Juan Díaz', // Default for simulation
      items: []
    });
    setIsModalOpen(true);
  };

  const openEditRequest = (req: MaterialRequest) => {
    setEditingRequest(JSON.parse(JSON.stringify(req)));
    setIsModalOpen(true);
  };

  const openViewDetail = (req: MaterialRequest) => {
    setSelectedRequest(req);
    setIsDetailOpen(true);
  };

  const addItemToRequest = () => {
    if (!editingRequest || !newItemDesc) return;
    const item: MaterialRequestItem = {
      description: newItemDesc,
      quantity: newItemQty,
      source: newItemSource
    };
    setEditingRequest({
      ...editingRequest,
      items: [...editingRequest.items, item]
    });
    setNewItemDesc('');
    setNewItemQty(1);
  };

  const removeItem = (index: number) => {
    if (!editingRequest) return;
    const newItems = editingRequest.items.filter((_, i) => i !== index);
    setEditingRequest({ ...editingRequest, items: newItems });
  };

  const handleSave = () => {
    if (!editingRequest || !editingRequest.ticketId || editingRequest.items.length === 0) {
      alert("Complete el ticket y añada al menos un material.");
      return;
    }
    setRequests(prev => {
      const exists = prev.find(r => r.id === editingRequest.id);
      if (exists) return prev.map(r => r.id === editingRequest.id ? editingRequest : r);
      return [...prev, editingRequest];
    });
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      <Header title="Solicitudes de Material" breadcrumbs={[{ label: 'Materiales' }]} />
      
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              Gestión de <span className="text-primary">Insumos</span>
            </h2>
            <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">Control de consumibles y requerimientos por ticket operativo</p>
          </div>
          <button 
            onClick={openNewRequest}
            className="bg-primary text-black font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(242,162,13,0.3)] hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm font-black">add_shopping_cart</span>
            Nueva Solicitud
          </button>
        </div>

        {/* Listado de Solicitudes */}
        <div className="bg-card-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/10">
                  <th className="px-6 py-5">ID / Fecha</th>
                  <th className="px-6 py-5">Ticket Destino</th>
                  <th className="px-6 py-5">Solicitante</th>
                  <th className="px-6 py-5">Items</th>
                  <th className="px-6 py-5">Estado</th>
                  <th className="px-6 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-sm font-mono font-bold text-white group-hover:text-primary transition-colors">{req.id}</p>
                      <p className="text-[9px] text-slate-500 font-black uppercase mt-0.5">{req.createdAt}</p>
                    </td>
                    <td className="px-6 py-5 font-bold text-primary font-mono text-sm">
                      {req.ticketId}
                    </td>
                    <td className="px-6 py-5 text-xs text-white/70 font-bold uppercase">
                      {req.technician}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex -space-x-2">
                         {req.items.slice(0, 3).map((_, i) => (
                           <div key={i} className="size-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[10px] text-primary">inventory_2</span>
                           </div>
                         ))}
                         {req.items.length > 3 && (
                           <div className="size-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[9px] font-black text-primary">
                             +{req.items.length - 3}
                           </div>
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${
                        req.status === 'Pendiente' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                        req.status === 'Cancelado' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => openViewDetail(req)}
                        className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all border border-white/5"
                        title="Ver / Imprimir"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button 
                        onClick={() => openEditRequest(req)}
                        className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-accent-blue hover:bg-accent-blue/10 transition-all border border-white/5"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined">edit_note</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: CREACIÓN / EDICIÓN */}
      {isModalOpen && editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card-dark border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  {requests.find(r => r.id === editingRequest.id) ? 'Editar' : 'Nueva'} <span className="text-primary">Solicitud</span>
                </h3>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">ID: {editingRequest.id} • Proceso de Requerimiento Técnico</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">Vincular a Ticket</label>
                   <select 
                     value={editingRequest.ticketId}
                     onChange={e => setEditingRequest({...editingRequest, ticketId: e.target.value})}
                     className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none"
                   >
                     <option value="">Seleccione un ticket activo...</option>
                     {MOCK_TICKETS.map(tk => (
                       <option key={tk.id} value={tk.id}>{tk.id} - {tk.location}</option>
                     ))}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] text-primary font-black uppercase tracking-widest ml-1">Estado de Solicitud</label>
                   <select 
                     value={editingRequest.status}
                     onChange={e => setEditingRequest({...editingRequest, status: e.target.value as any})}
                     className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none"
                   >
                     <option value="Pendiente">Pendiente</option>
                     <option value="Surtido">Surtido</option>
                     <option value="Cancelado">Cancelado</option>
                   </select>
                 </div>
              </div>

              {/* Constructor de Items */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-2">Añadir Insumos</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                  <div className="md:col-span-2 space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase ml-1">Descripción del Material</p>
                    <input 
                      type="text" 
                      placeholder="Eje: Cable Canaleta 20x10"
                      value={newItemDesc}
                      onChange={e => setNewItemDesc(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase ml-1">Cant. / Origen</p>
                    <div className="flex gap-2">
                       <input 
                        type="number" 
                        min="1"
                        value={newItemQty}
                        onChange={e => setNewItemQty(parseInt(e.target.value))}
                        className="w-16 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-primary outline-none text-center"
                      />
                      <select 
                        value={newItemSource}
                        onChange={e => setNewItemSource(e.target.value as any)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] font-black text-white focus:border-primary outline-none uppercase"
                      >
                        <option value="Taller">Taller</option>
                        <option value="Compra">Compra</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={addItemToRequest}
                    className="h-[46px] bg-primary text-black font-black text-[10px] uppercase rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-lg"
                  >
                    Insertar Item
                  </button>
                </div>
              </div>

              {/* Listado de Items en la solicitud actual */}
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Resumen de Carga ({editingRequest.items.length})</h4>
                 <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-[9px] font-black uppercase text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Insumo</th>
                          <th className="px-5 py-3 text-center">Cant.</th>
                          <th className="px-5 py-3">Origen</th>
                          <th className="px-5 py-3 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {editingRequest.items.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-5 py-8 text-center text-[10px] text-slate-600 font-bold uppercase italic tracking-widest">
                              No hay items en la solicitud
                            </td>
                          </tr>
                        ) : (
                          editingRequest.items.map((item, idx) => (
                            <tr key={idx} className="text-xs text-white/80 group/item">
                              <td className="px-5 py-4 font-bold">{item.description}</td>
                              <td className="px-5 py-4 text-center font-mono font-black">{item.quantity}</td>
                              <td className="px-5 py-4">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.source === 'Taller' ? 'bg-accent-blue/10 text-accent-blue' : 'bg-primary/10 text-primary'}`}>
                                  {item.source}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button onClick={() => removeItem(idx)} className="text-red-500/40 hover:text-red-500 transition-colors">
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                 </div>
              </div>
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4 shrink-0">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">Descartar</button>
               <button 
                onClick={handleSave}
                className="flex-[2] py-4 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
               >
                Guardar Requerimiento
               </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETALLE / IMPRESIÓN (VISTA DE AUDITORÍA) */}
      {isDetailOpen && selectedRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(242,162,13,0.3)] flex flex-col">
            <div className="bg-slate-900 text-white p-8 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <div className="bg-primary size-12 flex items-center justify-center rounded-xl text-black font-black">TO</div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Vale de <span className="text-primary">Materiales</span></h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">TechOps Pro • Central Logistics</p>
                  </div>
               </div>
               <button onClick={() => setIsDetailOpen(false)} className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>

            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar space-y-10">
               <div className="grid grid-cols-2 gap-12 border-b border-slate-100 pb-10">
                 <div className="space-y-4">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Identificador</p>
                      <p className="text-2xl font-black font-mono tracking-tighter">{selectedRequest.id}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ticket Origen</p>
                      <p className="text-lg font-bold text-primary">{selectedRequest.ticketId}</p>
                    </div>
                 </div>
                 <div className="space-y-4 text-right">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha de Emisión</p>
                      <p className="text-sm font-bold">{selectedRequest.createdAt}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Solicitante</p>
                      <p className="text-sm font-bold uppercase">{selectedRequest.technician}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200">
                       <span className="size-1.5 rounded-full bg-primary"></span>
                       <span className="text-[10px] font-black uppercase">{selectedRequest.status}</span>
                    </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Desglose de Materiales</p>
                 <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase">
                        <th className="py-4">Cant.</th>
                        <th className="py-4">Descripción del Insumo</th>
                        <th className="py-4 text-right">Abastecimiento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRequest.items.map((item, i) => (
                        <tr key={i} className="text-sm">
                          <td className="py-4 font-black font-mono">{item.quantity}</td>
                          <td className="py-4 font-medium text-slate-600">{item.description}</td>
                          <td className="py-4 text-right">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                              {item.source}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>

               <div className="grid grid-cols-2 gap-12 pt-16">
                  <div className="border-t border-slate-300 pt-4 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Firma Autoriza (Taller)</p>
                    <div className="h-12"></div>
                  </div>
                  <div className="border-t border-slate-300 pt-4 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Firma Recibe (Técnico)</p>
                    <div className="h-12 italic text-slate-300 font-serif flex items-center justify-center text-xl">{selectedRequest.technician}</div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
               <button 
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg"
               >
                 <span className="material-symbols-outlined text-lg">print</span>
                 Imprimir Vale PDF
               </button>
               <button 
                className="flex-1 bg-primary text-black font-black text-[10px] uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg"
               >
                 <span className="material-symbols-outlined text-lg">mail</span>
                 Enviar Copia
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
