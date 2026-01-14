
import React, { useState, useRef } from 'react';
import { AppClient, AppStore, AppStoreDocument } from '../types';

export const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<AppClient[]>([
    { id: '1', name: 'Retail Corp Internacional', storesCount: 2, activeTickets: 24, status: 'Active', logo: 'RC' },
    { id: '2', name: 'Gasolineras del Norte', storesCount: 0, activeTickets: 8, status: 'Active', logo: 'GN' },
    { id: '3', name: 'Logística Global SA', storesCount: 0, activeTickets: 45, status: 'Critical', logo: 'LG' },
    { id: '4', name: 'Banco Financiero', storesCount: 0, activeTickets: 2, status: 'Idle', logo: 'BF' }
  ]);

  const [stores, setStores] = useState<AppStore[]>([
    { id: 's1', clientId: '1', name: 'Sucursal Centro', location: 'Av. Juárez 102', code: 'STR-404', documents: [{ id: 'd1', name: 'Planos_Electricos.pdf', uploadDate: '2024-10-10', size: '2.4MB' }] },
    { id: 's2', clientId: '1', name: 'Sucursal Norte', location: 'Plaza Satélite', code: 'STR-215', documents: [] },
  ]);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isStoreDetailOpen, setIsStoreDetailOpen] = useState(false);
  
  const [editingClient, setEditingClient] = useState<AppClient | null>(null);
  const [selectedClientForStores, setSelectedClientForStores] = useState<AppClient | null>(null);
  const [selectedStoreForDetail, setSelectedStoreForDetail] = useState<AppStore | null>(null);
  
  const [newStore, setNewStore] = useState({ name: '', location: '', code: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleOpenClientModal = (client?: AppClient) => {
    if (client) {
      setEditingClient({ ...client });
    } else {
      setEditingClient({
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        storesCount: 0,
        activeTickets: 0,
        status: 'Active',
        logo: ''
      });
    }
    setIsClientModalOpen(true);
  };

  const handleSaveClient = () => {
    if (!editingClient || !editingClient.name) return;
    setClients(prev => {
      const exists = prev.find(c => c.id === editingClient.id);
      if (exists) return prev.map(c => c.id === editingClient.id ? editingClient : c);
      return [...prev, editingClient];
    });
    setIsClientModalOpen(false);
  };

  const openStoreManagement = (client: AppClient) => {
    setSelectedClientForStores(client);
    setIsStoreModalOpen(true);
  };

  const openStoreDetail = (store: AppStore) => {
    setSelectedStoreForDetail(store);
    setIsStoreDetailOpen(true);
  };

  const handleAddStoreManual = () => {
    if (!selectedClientForStores || !newStore.name || !newStore.code) return;
    
    const storeToAdd: AppStore = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: selectedClientForStores.id,
      ...newStore,
      documents: []
    };

    setStores([...stores, storeToAdd]);
    setNewStore({ name: '', location: '', code: '' });
    
    setClients(prev => prev.map(c => 
      c.id === selectedClientForStores.id ? { ...c, storesCount: c.storesCount + 1 } : c
    ));
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStoreForDetail) {
      const newDoc: AppStoreDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        size: (file.size / 1024 / 1024).toFixed(2) + 'MB'
      };

      const updatedStores = stores.map(s => {
        if (s.id === selectedStoreForDetail.id) {
          const docs = s.documents || [];
          return { ...s, documents: [...docs, newDoc] };
        }
        return s;
      });

      setStores(updatedStores);
      setSelectedStoreForDetail(updatedStores.find(s => s.id === selectedStoreForDetail.id) || null);
      if (docInputRef.current) docInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background-dark/95">
      {/* Encabezado Simplificado */}
      <div className="h-16 border-b border-white/5 flex items-center px-8 shrink-0">
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">Módulo Administrativo</span>
      </div>
      
      <input type="file" ref={fileInputRef} className="hidden" accept=".csv" />

      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              Matriz de <span className="text-primary">Clientes</span>
            </h2>
            <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">Control centralizado de infraestructura operativa</p>
          </div>
          <button 
            onClick={() => handleOpenClientModal()}
            className="bg-primary text-black font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(242,162,13,0.3)] hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add_business</span>
            Nuevo Cliente
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-card-dark border border-white/5 rounded-3xl p-6 hover:border-primary/40 transition-all group flex flex-col shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-black text-primary border border-white/10 group-hover:bg-primary group-hover:text-black transition-all">
                  {client.logo || client.name.charAt(0)}
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  client.status === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  client.status === 'Idle' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' :
                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  {client.status}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-4 group-hover:text-primary transition-colors">{client.name}</h3>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Sucursales</p>
                    <p className="text-xl font-black text-white">{client.storesCount}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Op. Activas</p>
                    <p className={`text-xl font-black ${client.activeTickets > 10 ? 'text-primary' : 'text-white'}`}>{client.activeTickets}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <button 
                  onClick={() => openStoreManagement(client)}
                  className="w-full py-3 rounded-xl bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-black transition-all border border-primary/20 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm font-black">domain</span>
                  Gestionar Sucursales
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Principal de Sucursales */}
      {isStoreModalOpen && selectedClientForStores && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card-dark border border-white/10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  Sucursales de <span className="text-primary">{selectedClientForStores.name}</span>
                </h3>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Carga manual y auditoría de tiendas</p>
              </div>
              <button onClick={() => setIsStoreModalOpen(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Panel Lateral: Carga Manual */}
              <div className="w-full md:w-80 p-8 border-r border-white/5 bg-black/40 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Nueva Sucursal (Manual)</h4>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Nombre de la Tienda" 
                      value={newStore.name}
                      onChange={e => setNewStore({...newStore, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-primary outline-none transition-all"
                    />
                    <input 
                      type="text" 
                      placeholder="Código STR-XXX" 
                      value={newStore.code}
                      onChange={e => setNewStore({...newStore, code: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-primary outline-none transition-all font-mono uppercase"
                    />
                    <input 
                      type="text" 
                      placeholder="Dirección Completa" 
                      value={newStore.location}
                      onChange={e => setNewStore({...newStore, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-primary outline-none transition-all"
                    />
                    <button 
                      onClick={handleAddStoreManual}
                      className="w-full py-4 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Añadir a Matriz
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Carga Masiva</h4>
                  <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    Importar CSV
                  </button>
                </div>
              </div>

              {/* Listado de Sucursales Registradas */}
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-card-dark">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stores.filter(s => s.clientId === selectedClientForStores.id).length === 0 ? (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-3xl">
                       <span className="material-symbols-outlined text-4xl text-white/5">add_location_alt</span>
                       <p className="text-xs text-slate-600 mt-2 font-black uppercase tracking-widest">Sin sucursales registradas</p>
                    </div>
                  ) : (
                    stores.filter(s => s.clientId === selectedClientForStores.id).map(store => (
                      <div key={store.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-primary/30 transition-all group flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="px-2 py-1 rounded bg-black text-[9px] font-mono font-black text-primary border border-primary/20">{store.code}</span>
                            <span className="material-symbols-outlined text-slate-600 text-lg">storefront</span>
                          </div>
                          <h5 className="text-white font-bold text-sm mb-1">{store.name}</h5>
                          <p className="text-[10px] text-slate-500 leading-snug truncate">{store.location}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                          <button 
                            onClick={() => openStoreDetail(store)}
                            className="flex-1 py-2 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-black transition-all"
                          >
                            Ver Detalles
                          </button>
                          <button className="px-3 rounded-lg bg-white/5 text-slate-600 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detalle de Sucursal y Documentos de Respaldo */}
      {isStoreDetailOpen && selectedStoreForDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-surface-dark border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_120px_rgba(242,162,13,0.15)] flex flex-col">
            <div className="p-8 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black border border-primary/30">
                  {selectedStoreForDetail.code.slice(-3)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic">{selectedStoreForDetail.name}</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Expediente Técnico de Sucursal</p>
                </div>
              </div>
              <button onClick={() => setIsStoreDetailOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] text-primary font-black uppercase tracking-widest">Ubicación Registrada</p>
                  <p className="text-sm text-white font-medium">{selectedStoreForDetail.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-primary font-black uppercase tracking-widest">Identificador Interno</p>
                  <p className="text-sm text-white font-mono">{selectedStoreForDetail.code}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">folder_open</span>
                    Documentos de Respaldo
                  </h4>
                  <button 
                    onClick={() => docInputRef.current?.click()}
                    className="text-[9px] font-black text-accent-blue uppercase tracking-widest hover:underline"
                  >
                    + Subir Nuevo Doc
                  </button>
                  <input type="file" ref={docInputRef} onChange={handleDocUpload} className="hidden" />
                </div>

                <div className="space-y-2">
                  {(selectedStoreForDetail.documents || []).length === 0 ? (
                    <div className="py-8 text-center bg-black/20 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-600 font-bold uppercase italic">Sin documentos cargados en el expediente</p>
                    </div>
                  ) : (
                    selectedStoreForDetail.documents?.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-slate-500">description</span>
                          <div>
                            <p className="text-xs font-bold text-white/80">{doc.name}</p>
                            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">{doc.uploadDate} • {doc.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-primary hover:scale-110 transition-transform"><span className="material-symbols-outlined text-lg">download</span></button>
                          <button className="text-red-500 hover:scale-110 transition-transform"><span className="material-symbols-outlined text-lg">delete</span></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
               <button 
                onClick={() => setIsStoreDetailOpen(false)}
                className="px-12 py-3 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 rounded-xl hover:bg-white/10 transition-all border border-white/10"
               >
                Cerrar Expediente
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear Cliente */}
      {isClientModalOpen && editingClient && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card-dark border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Nuevo <span className="text-primary">Cliente</span></h3>
              <button onClick={() => setIsClientModalOpen(false)} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-primary font-black uppercase tracking-widest">Razón Social</label>
                <input type="text" value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-primary font-black uppercase tracking-widest text-center block">Logo (3 letras)</label>
                  <input type="text" maxLength={3} value={editingClient.logo} onChange={e => setEditingClient({...editingClient, logo: e.target.value.toUpperCase()})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-center text-xl font-black text-white focus:border-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-primary font-black uppercase tracking-widest text-center block">Estatus</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-primary outline-none appearance-none text-center">
                    <option value="Active">Activo</option>
                    <option value="Critical">Crítico</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
               <button onClick={() => setIsClientModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Descartar</button>
               <button onClick={handleSaveClient} className="flex-[2] py-4 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-xl">Crear Cuenta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
